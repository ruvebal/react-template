/*
 * Implements: ktx2-basis — "Load the packed sleeve" (Excerpt), the ETC1S and UASTC
 * paths of /ex5-ktx2. three 0.185.1, its own KTX2Loader (ESM, three/addons).
 * https://ruvebal.github.io/web-atelier-udit/lessons/en/feii/ktx2-basis/
 *
 * Deviations from the fence:
 *   1. File name. The fence replaces src/sleevePicture.js; here it sits beside it.
 *   2. TRANSCODER_PATH is `import.meta.env.BASE_URL + 'basis/'` instead of '/basis/' —
 *      the form the lesson itself names for a site served from a subfolder. The two
 *      files in public/basis/ are copied from node_modules/three/examples/jsm/libs/basis/
 *      of the pinned three 0.185.1, never from a CDN.
 *   3. The file is a parameter, `useSleevePicture(url)`, instead of the fence's
 *      hard-coded '/sleeve-etc1s.ktx2', so the switch can pick ETC1S or UASTC.
 * setTranscoderPath + detectSupport(gl), and not touching colorSpace, are the fence's.
 */
import { useLoader, useThree } from '@react-three/fiber';
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js';

// Copied by hand from node_modules/three/examples/jsm/libs/basis/ — same three.js version.
const TRANSCODER_PATH = import.meta.env.BASE_URL + 'basis/';

/**
 * Loads the packed sleeve. The loader sets `colorSpace` from the file itself,
 * so this hook does not touch it: check it instead (see the two traps).
 *
 * @param {string} url Where Vite serves the `.ktx2` file (under `public/`).
 * @returns {import('three').CompressedTexture} The texture to pass to the material as `map`.
 */
export function useSleevePicture(url) {
  const gl = useThree((state) => state.gl);
  return useLoader(KTX2Loader, url, (loader) => {
    loader.setTranscoderPath(TRANSCODER_PATH);
    loader.detectSupport(gl);
  });
}
