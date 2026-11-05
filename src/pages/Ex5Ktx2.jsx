import { Suspense, useCallback, useEffect, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { SRGBColorSpace } from 'three';
import BudgetProbe from '../BudgetProbe.jsx';
import usePrefersReducedMotion from '../hooks/usePrefersReducedMotion.js';
import Cover from '../cover/Cover.jsx';
import CoverReadout from '../cover/CoverReadout.jsx';
import { CEILING_SLEEVE } from '../cover/budget.js';
import { gpuBytes } from '../cover/gpuBytes.js';
import { PARTS } from '../cover/parts.js';
import { useSleevePicture as useFilePicture } from '../cover/sleevePictureFile.js';
import { useSleevePicture as useKtx2Picture } from '../cover/sleevePictureKtx2.js';
import { CAMERA, DPR, GL, LOOK_AT } from '../cover/stage.js';

const TITLE = 'Ex5 — KTX2 switch';
const BASE = import.meta.env.BASE_URL;

/**
 * ktx2-basis satellite, the hello-world switch (KTX2-FIRST-PRINCIPLES §6): one original
 * 512 × 512 picture, three deliveries. public/ex5/ holds the source PNG and the two
 * encodes made from it by scripts/encode-ex5.sh (toktx 4.4.2).
 */
const MODES = [
  { id: 'png', label: 'PNG', url: `${BASE}ex5/sleeve.png`, packed: false },
  { id: 'etc1s', label: 'ETC1S .ktx2', url: `${BASE}ex5/sleeve-etc1s.ktx2`, packed: true },
  { id: 'uastc', label: 'UASTC .ktx2', url: `${BASE}ex5/sleeve-uastc.ktx2`, packed: true },
];

const bytes = (value) => (typeof value === 'number' ? value.toLocaleString('en-US') : '…');

/**
 * Hands the loaded texture up to the page (for the numbers) and frees its GPU copy
 * when the switch moves on. Without dispose(), useLoader's cache keeps every mode the
 * visitor has tried alive on the GPU, and `renderer.info.memory.textures` would climb
 * 2 → 3 → 4 instead of counting the sleeve on screen. A disposed texture keeps its
 * pixels in memory, so switching back re-uploads it from the cache.
 */
function useReportPicture(id, picture, onPicture) {
  useEffect(() => {
    onPicture({ id, picture });
    return () => {
      onPicture(null);
      picture.dispose();
    };
  }, [id, picture, onPicture]);
}

/** PNG path: cover-shaders' own-photo loader. three unpacks it to RGBA on upload. */
function PngSleeve({ mode, onPicture, ...cover }) {
  const picture = useFilePicture(mode.url);
  useReportPicture(mode.id, picture, onPicture);
  return <Cover {...cover} picture={picture} />;
}

/** Packed path: ktx2-basis' KTX2Loader. The transcoder picks this GPU's format. */
function Ktx2Sleeve({ mode, onPicture, ...cover }) {
  const picture = useKtx2Picture(mode.url);
  useReportPicture(mode.id, picture, onPicture);
  return <Cover {...cover} picture={picture} />;
}

export default function Ex5Ktx2() {
  const reduced = usePrefersReducedMotion();
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);
  const [budget, setBudget] = useState(null);
  const [modeId, setModeId] = useState('png');
  const [shown, setShown] = useState(null);
  const [fileBytes, setFileBytes] = useState({});

  const mode = MODES.find((item) => item.id === modeId);
  const onPicture = useCallback((value) => setShown(value), []);

  useEffect(() => {
    document.body.style.cursor = hovered ? 'pointer' : 'auto';
    return () => {
      document.body.style.cursor = 'auto';
    };
  }, [hovered]);

  /**
   * File bytes — the suitcase. Measured from what the server actually sends, not typed
   * in: fetch each file once and read the body's size. The browser cache serves the
   * loaders the same bytes. A text/html answer is Vite's SPA fallback for a missing
   * file, so it is reported as missing rather than counted.
   */
  useEffect(() => {
    let live = true;
    Promise.all(
      MODES.map(async (item) => {
        const response = await fetch(item.url);
        const type = response.headers.get('content-type') ?? '';
        if (!response.ok || type.includes('text/html')) return [item.id, null];
        return [item.id, (await response.blob()).size];
      }),
    )
      .then((entries) => {
        if (live) setFileBytes(Object.fromEntries(entries));
      })
      .catch(() => {
        if (live) setFileBytes({ png: null, etc1s: null, uastc: null });
      });
    return () => {
      live = false;
    };
  }, []);

  // The room — computed from what was uploaded (gpuBytes.js), only once the texture on
  // screen belongs to the selected mode.
  const picture = shown?.id === modeId ? shown.picture : null;
  const room = picture ? gpuBytes(picture) : null;
  const room0 = picture ? gpuBytes(picture, { levels: 'level0' }) : null;
  const Sleeve = mode.packed ? Ktx2Sleeve : PngSleeve;
  const coverProps = {
    hovered,
    selected,
    reduced,
    onHover: setHovered,
    onSelect: setSelected,
  };

  return (
    <div className="stage">
      <div className="stage-canvas" role="img" aria-label={`${TITLE} WebGL scene, ${mode.label} sleeve`}>
        <Canvas
          camera={CAMERA}
          dpr={DPR}
          gl={GL}
          onPointerLeave={() => setHovered(null)}
          onPointerMissed={() => setHovered(null)}
        >
          <color attach="background" args={['#161411']} />
          <ambientLight intensity={0.4} />
          <directionalLight position={[4, 6, 2]} intensity={2.4} />
          <directionalLight position={[-3, 2.2, -2]} intensity={0.55} />
          {/* While a file loads, the cover shows its flat Unit 8 sleeve (textures 1). */}
          <Suspense fallback={<Cover {...coverProps} />}>
            <Sleeve key={mode.id} mode={mode} onPicture={onPicture} {...coverProps} />
          </Suspense>
          <BudgetProbe onSample={setBudget} />
          <OrbitControls enablePan={false} target={LOOK_AT} />
        </Canvas>
      </div>
      <CoverReadout
        title={TITLE}
        parts={PARTS}
        hovered={hovered}
        selected={selected}
        onSelect={setSelected}
        budget={budget}
        ceiling={CEILING_SLEEVE}
      >
        <fieldset className="switch">
          <legend>Sleeve file</legend>
          {MODES.map((item) => (
            <label key={item.id}>
              <input
                type="radio"
                name="ex5-sleeve-file"
                value={item.id}
                checked={modeId === item.id}
                onChange={() => setModeId(item.id)}
              />
              {item.label}
            </label>
          ))}
        </fieldset>
        <dl className="measure" aria-live="polite">
          <dt>file bytes (suitcase)</dt>
          <dd>
            {fileBytes[modeId] === null ? 'missing — run scripts/encode-ex5.sh' : bytes(fileBytes[modeId])}
          </dd>
          <dt>GPU bytes (room)</dt>
          <dd>{room ? `${bytes(room.bytes)} · all ${room.levels} levels` : 'Loading…'}</dd>
          <dt>GPU bytes, level 0 only</dt>
          <dd>{room0 ? bytes(room0.bytes) : '…'}</dd>
          <dt>texture.format</dt>
          <dd>{room ? room.format : '…'}</dd>
          <dt>colorSpace === SRGBColorSpace</dt>
          <dd>
            {picture
              ? `${picture.colorSpace === SRGBColorSpace ? 'yes' : 'NO'} ('${picture.colorSpace}')`
              : '…'}
          </dd>
          <dt>renderer.info.memory.textures (a count, not bytes)</dt>
          <dd>{budget ? budget.textures : 'Sampling…'}</dd>
        </dl>
        <p className="meta">
          Orientation check: on the sleeve, uv 0,0 sits bottom-left, uv 1,1 top-right, and the
          title reads upright — in every mode. A wrong one is fixed in the encode, not by
          flipping vUv in the shader.
        </p>
        <p className="meta">
          texture.format belongs to this device. The same file can take a different room on
          another GPU, so write the format next to the number.
        </p>
      </CoverReadout>
    </div>
  );
}
