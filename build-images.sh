#!/bin/bash
# Generate web-ready derivatives from the full-res originals in originals/.
# Originals are never modified — everything is written into images/.
#
#   ./build-images.sh
#
# Afterwards, entries.txt holds ready-to-paste lines for src/content.ts.
set -euo pipefail

cd "$(dirname "$0")"

SRC_DIR="originals"
OUT="images"
FULL_EDGE=2000     # gallery / lightbox
THUMB_EDGE=900     # grid tiles
JPEG_Q=82
WEBP_Q=80

# EXIF worth keeping: camera, lens, exposure, capture time.
# Everything else (Sony MakerNotes, embedded preview thumbnail, XMP) is dropped.
KEEP=(-EXIF:Make -EXIF:Model -EXIF:LensModel -EXIF:FNumber -EXIF:ExposureTime
      -EXIF:ISO -EXIF:FocalLength -EXIF:DateTimeOriginal)

shopt -s nullglob nocaseglob
sources=("$SRC_DIR"/*.jpg "$SRC_DIR"/*.jpeg)
shopt -u nocaseglob

if [ ${#sources[@]} -eq 0 ]; then
  echo "No .jpg or .jpeg files found in $SRC_DIR/" >&2
  exit 1
fi

rm -rf "$OUT"
mkdir -p "$OUT/full" "$OUT/thumb"
: > entries.txt

resize_to () {  # <src> <dst> <edge>
  sips -Z "$3" \
       --setProperty format jpeg \
       --setProperty formatOptions "$JPEG_Q" \
       "$1" --out "$2" >/dev/null
}

for src in "${sources[@]}"; do
  name="${src##*/}"          # strip directory
  base="${name%.*}"          # strip extension, whatever its case
  printf '%-16s' "$base"

  for variant in full thumb; do
    [ "$variant" = full ] && edge=$FULL_EDGE || edge=$THUMB_EDGE
    jpg="$OUT/$variant/$base.jpg"

    resize_to "$src" "$jpg" "$edge"

    # Strip everything, then copy back only the tags we want from the original.
    exiftool -q -overwrite_original \
      -all= -tagsfromfile "$src" "${KEEP[@]}" \
      -ColorSpace=sRGB "$jpg"

    cwebp -quiet -q "$WEBP_Q" -metadata none "$jpg" -o "$OUT/$variant/$base.webp"
  done

  # Emit a content.ts line with the real dimensions already filled in.
  read -r w h < <(sips -g pixelWidth -g pixelHeight "$OUT/full/$base.jpg" \
                  | awk '/pixelWidth/{w=$2}/pixelHeight/{h=$2}END{print w, h}')
  printf "      { file: '%s', w: %s, h: %s, alt: '' },\n" "$base" "$w" "$h" >> entries.txt

  f_web=$(stat -f%z "$OUT/full/$base.webp")
  t_web=$(stat -f%z "$OUT/thumb/$base.webp")
  printf 'full %5dKB webp   thumb %4dKB webp   %sx%s\n' \
    $((f_web/1024)) $((t_web/1024)) "$w" "$h"
done

echo
echo "originals : $(du -ch "${sources[@]}" | tail -1 | cut -f1)"
echo "full/     : $(du -sh $OUT/full | cut -f1)"
echo "thumb/    : $(du -sh $OUT/thumb | cut -f1)"
echo
echo "Paste-ready entries written to entries.txt"
