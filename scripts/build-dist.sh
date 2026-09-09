#!/bin/bash
# Assemble dist/ — exactly what gets published, and nothing else.
# Deliberately excludes originals/ (369 MB of camera files), node_modules/, and
# src/. Run after `npm run build`.
set -euo pipefail
cd "$(dirname "$0")/.."

DIST="dist"
rm -rf "$DIST"
mkdir -p "$DIST"

cp index.html styles.css "$DIST/"
cp -R js "$DIST/js"
cp -R images "$DIST/images"

# Source maps are a development aid; no reason to ship them.
find "$DIST/js" -name '*.map' -delete

# Long-cache the images (their names change when content changes), but always
# revalidate the HTML so edits appear immediately.
cat > "$DIST/_headers" <<'HEADERS'
/images/*
  Cache-Control: public, max-age=31536000, immutable
/js/*
  Cache-Control: public, max-age=3600
/
  Cache-Control: public, max-age=0, must-revalidate
HEADERS

echo "dist/ contents:"
du -sh "$DIST"/* | sed 's/^/  /'
echo
echo "total: $(du -sh "$DIST" | cut -f1)"
