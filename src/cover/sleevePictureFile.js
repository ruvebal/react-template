/*
 * Implements: cover-shaders — "Your own photo" (Template), the PNG path of /ex5-ktx2.
 * https://ruvebal.github.io/web-atelier-udit/lessons/en/feii/cover-shaders/
 *
 * Deviations from the fence:
 *   1. File name. The fence replaces src/sleevePicture.js. This reference keeps
 *      sleevePicture.js for /ex4-cover-shader, so the own-photo version lives beside it.
 *   2. The path is a parameter, `useSleevePicture(url)`, instead of the fence's
 *      hard-coded '/sleeve.jpg'. /ex5-ktx2 passes
 *      `import.meta.env.BASE_URL + 'ex5/sleeve.png'`, the original source PNG that the
 *      two .ktx2 files were encoded from (scripts/encode-ex5.sh).
 * The tag function, its position outside the hook, and the drei call are the fence's.
 */
import { useTexture } from '@react-three/drei';
import { SRGBColorSpace } from 'three';

function tagScreenColours(texture) {
  // A photo holds screen colours. This tag tells the GPU to unpack them before the maths.
  texture.colorSpace = SRGBColorSpace;
}

/**
 * Loads your own sleeve photo from `url`. The Canvas waits,
 * blank, until the file has arrived.
 *
 * @param {string} url Where Vite serves the picture (a file under `public/`).
 * @returns {import('three').Texture} The texture to pass to the material as `map`.
 */
export function useSleevePicture(url) {
  return useTexture(url, tagScreenColours);
}
