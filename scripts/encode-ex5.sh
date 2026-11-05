#!/usr/bin/env bash
# Rebuilds the /ex5-ktx2 sleeve files from the original art in scripts/ex5-sleeve.svg.
#
#   scripts/ex5-sleeve.svg ──rsvg-convert──► public/ex5/sleeve.png          (source PNG)
#                          ──toktx──────────► public/ex5/sleeve-etc1s.ktx2  (ETC1S)
#                          ──toktx──────────► public/ex5/sleeve-uastc.ktx2  (UASTC + zstd 18)
#
# Encoder: KTX-Software toktx / ktx v4.4.2 (the version the ktx2-basis lesson checked).
# Flags are the lesson's "Encode — the two commands" Template:
#   --lower_left_maps_to_s0t0  three.js does not flip a packed picture on upload (trap 1)
#   --assign_oetf srgb         label the pixels as the screen colours they are (trap 2);
#                              never --convert_oetf, which rewrites pixels from a wrong tag
#   --genmipmap                ten levels, like the PNG three.js mipmaps, so GPU bytes compare
#   --zcmp 18                  UASTC only: zstd file packing; GPU bytes do not change
#
# Missing tools fail loudly. Without an encoder, keep the committed files; never fake a .ktx2.
# The transcoder pair in public/basis/ is copied from the pinned three.js (`--transcoder`).
set -euo pipefail

cd "$(dirname "$0")/.."
SVG=scripts/ex5-sleeve.svg
OUT=public/ex5
SRC="$OUT/sleeve.png"

need() { command -v "$1" >/dev/null 2>&1 || { echo "encode-ex5: '$1' not found — install it or keep the committed files" >&2; exit 1; }; }

if [[ "${1:-}" == "--transcoder" ]]; then
  mkdir -p public/basis
  cp node_modules/three/examples/jsm/libs/basis/basis_transcoder.js \
     node_modules/three/examples/jsm/libs/basis/basis_transcoder.wasm public/basis/
  echo "copied transcoder from three $(node -p "JSON.parse(require('fs').readFileSync('node_modules/three/package.json','utf8')).version")"
  exit 0
fi

need toktx
need ktx
mkdir -p "$OUT"

if [[ "${1:-}" != "--keep-png" ]]; then
  need rsvg-convert
  rsvg-convert -w 512 -h 512 "$SVG" -o "$SRC"
fi

toktx --version
toktx --t2 --encode etc1s --genmipmap --lower_left_maps_to_s0t0 --assign_oetf srgb \
  "$OUT/sleeve-etc1s.ktx2" "$SRC"
toktx --t2 --encode uastc --zcmp 18 --genmipmap --lower_left_maps_to_s0t0 --assign_oetf srgb \
  "$OUT/sleeve-uastc.ktx2" "$SRC"

# Both files must show Transfer: KHR_DF_TRANSFER_SRGB and KTXorientation: ru
for f in "$OUT/sleeve-etc1s.ktx2" "$OUT/sleeve-uastc.ktx2"; do
  echo "== $f"
  ktx info "$f" | grep -E "Transfer|KTXorientation|^levelCount|^pixelWidth|^pixelHeight|^supercompressionScheme|^vkFormat"
done
ls -l "$SRC" "$OUT"/*.ktx2
