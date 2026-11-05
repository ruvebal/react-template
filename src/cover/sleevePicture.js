/*
 * Implements: cover-shaders — `src/sleevePicture.js` (CodeSandbox-ready).
 * https://ruvebal.github.io/web-atelier-udit/lessons/en/feii/cover-shaders/
 *
 * Deviation from the fence: none. Used by /ex4-cover-shader.
 */
import { useEffect, useMemo } from 'react';
import { CanvasTexture, SRGBColorSpace } from 'three';

const SIZE = 512;

const PLACEHOLDER = {
  ground: '#1f3a5f',
  disc: '#e36a2c',
  ink: '#f4efe6',
};

/**
 * Paints a placeholder sleeve picture on a 2D canvas. Each corner is labelled
 * with its UV, so you can see which way the picture lands on the mesh.
 *
 * @param {string} title Album title, printed across the middle.
 * @returns {HTMLCanvasElement} A square canvas, 512 × 512 pixels.
 */
export function drawSleevePicture(title) {
  const canvas = document.createElement('canvas');
  canvas.width = SIZE;
  canvas.height = SIZE;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = PLACEHOLDER.ground;
  ctx.fillRect(0, 0, SIZE, SIZE);

  ctx.fillStyle = PLACEHOLDER.disc;
  ctx.beginPath();
  ctx.arc(SIZE / 2, SIZE / 2, SIZE * 0.28, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = PLACEHOLDER.ink;
  ctx.textBaseline = 'middle';
  ctx.textAlign = 'center';
  ctx.font = '600 36px system-ui, sans-serif';
  ctx.fillText(title, SIZE / 2, SIZE / 2);

  // Canvas rows count down from the top. The upload flips them, so the top row becomes v = 1.
  ctx.font = '22px ui-monospace, monospace';
  ctx.textAlign = 'left';
  ctx.fillText('uv 0,1', 16, 28);
  ctx.fillText('uv 0,0', 16, SIZE - 28);
  ctx.textAlign = 'right';
  ctx.fillText('uv 1,1', SIZE - 16, 28);
  ctx.fillText('uv 1,0', SIZE - 16, SIZE - 28);

  return canvas;
}

/**
 * Makes the sleeve picture once per title and frees its GPU copy when the
 * component that asked for it unmounts.
 *
 * @param {string} title Album title for the placeholder picture.
 * @returns {import('three').CanvasTexture} The texture to pass to the material as `map`.
 */
export function useSleevePicture(title) {
  const picture = useMemo(() => {
    const texture = new CanvasTexture(drawSleevePicture(title));
    // The canvas holds screen colours. This tag tells the GPU to unpack them before the maths.
    texture.colorSpace = SRGBColorSpace;
    return texture;
  }, [title]);

  useEffect(() => () => picture.dispose(), [picture]);

  return picture;
}
