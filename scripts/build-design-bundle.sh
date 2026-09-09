#!/bin/bash
# Assemble the Claude Design bundle: one self-contained preview per component.
# Class names and custom properties match styles.css exactly, so whatever comes
# back from the web project can be ported into the real stylesheet directly.
set -euo pipefail
cd "$(dirname "$0")/.."

BUNDLE="${1:?usage: build-design-bundle.sh <output-dir>}"
mkdir -p "$BUNDLE"

# Small inline copies so each card renders standalone — previews can't reach
# the site's images/ directory.
mini () { # <src> <width>
  local tmp
  tmp=$(mktemp /tmp/dsmini.XXXXXX).jpg
  magick "$1" -resize "${2}x" -quality 70 "$tmp" 2>/dev/null
  printf 'data:image/jpeg;base64,%s' "$(base64 -i "$tmp" | tr -d '\n')"
  rm -f "$tmp"
}

PROFILE=$(mini images/thumb/DSC00233.jpg 220)
P1=$(mini images/thumb/DSC00118.jpg 400)
P2=$(mini images/thumb/DSC00582.jpg 300)
P3=$(mini images/thumb/DSC00236.jpg 400)
P4=$(mini images/thumb/DSC00259.jpg 300)

# Shared token block, repeated into each card so they render independently.
read -r -d '' TOKENS <<'CSS' || true
  :root {
    --bg: #ffffff;
    --fg: #14161a;
    --muted: #6d7178;
    --rule: #e7e8ea;
    --tile-bg: #f4f5f6;
    --gap: 16px;
    --page: 1040px;
    --pad: clamp(1.25rem, 4vw, 2.5rem);
    --portrait: clamp(120px, 22vw, 168px);
    --tile-ratio: 1;
  }
  * { box-sizing: border-box; }
  body {
    margin: 0;
    background: var(--bg);
    color: var(--fg);
    font-family: ui-sans-serif, -apple-system, "Segoe UI", Inter, Helvetica, Arial, sans-serif;
    font-size: 16px;
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
  }
  img { display: block; max-width: 100%; height: auto; }
CSS

# --- Foundations -----------------------------------------------------------
cat > "$BUNDLE/foundations.html" <<HTML
<!-- @dsCard group="Foundations" -->
<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Foundations</title><style>
$TOKENS
  .wrap { padding: 32px; }
  h2 { font-size: .72rem; text-transform: uppercase; letter-spacing: .14em; color: var(--muted); margin: 0 0 14px; font-weight: 600; }
  .swatches { display: grid; grid-template-columns: repeat(auto-fill, minmax(132px, 1fr)); gap: 12px; margin-bottom: 34px; }
  .sw { border: 1px solid var(--rule); border-radius: 4px; overflow: hidden; }
  .sw div { height: 56px; }
  .sw p { margin: 0; padding: 8px 10px; font-size: .72rem; line-height: 1.45; }
  .sw code { color: var(--muted); }
  .type > * { margin: 0 0 12px; }
  .t-name { font-size: clamp(1.5rem, 4vw, 1.9rem); font-weight: 600; letter-spacing: -.02em; }
  .t-body { font-size: 1rem; }
  .t-tagline { font-size: .95rem; color: var(--muted); }
  .t-label { font-size: .72rem; text-transform: uppercase; letter-spacing: .14em; color: var(--muted); font-weight: 600; }
  .t-foot { font-size: .78rem; color: var(--muted); }
</style></head><body><div class="wrap">
  <h2>Colour</h2>
  <div class="swatches">
    <div class="sw"><div style="background:#ffffff;border-bottom:1px solid var(--rule)"></div><p>Page<br><code>--bg #ffffff</code></p></div>
    <div class="sw"><div style="background:#14161a"></div><p>Text<br><code>--fg #14161a</code></p></div>
    <div class="sw"><div style="background:#6d7178"></div><p>Muted<br><code>--muted #6d7178</code></p></div>
    <div class="sw"><div style="background:#e7e8ea"></div><p>Rule<br><code>--rule #e7e8ea</code></p></div>
    <div class="sw"><div style="background:#f4f5f6"></div><p>Tile<br><code>--tile-bg #f4f5f6</code></p></div>
    <div class="sw"><div style="background:#101012"></div><p>Lightbox<br><code>rgb(16 16 18 / .97)</code></p></div>
  </div>
  <h2>Type</h2>
  <div class="type">
    <p class="t-name">Wardum — name</p>
    <p class="t-tagline">Photography — Reykjavik — tagline .95rem</p>
    <p class="t-body">Body copy at 1rem / 1.6. Used for the bio and the booking line.</p>
    <p class="t-label">Section label .72rem</p>
    <p class="t-foot">Footer .78rem</p>
  </div>
</div></body></html>
HTML

# --- Profile ---------------------------------------------------------------
cat > "$BUNDLE/profile.html" <<HTML
<!-- @dsCard group="Sections" -->
<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Profile header</title><style>
$TOKENS
  .page { max-width: var(--page); margin: 0 auto; padding: 0 var(--pad); }
  .profile { padding: clamp(2.5rem,7vw,4.5rem) 0 clamp(2rem,5vw,3rem); text-align: center; }
  .profile__avatar img { width: var(--portrait); height: auto; margin: 0 auto; background: var(--tile-bg); }
  .profile__name { margin: 1.1rem 0 0; font-size: clamp(1.5rem,4vw,1.9rem); font-weight: 600; letter-spacing: -.02em; line-height: 1.15; }
  .profile__tagline { margin: .2rem 0 0; color: var(--muted); font-size: .95rem; }
  .profile__bio { margin: .9rem auto 0; max-width: 34rem; }
  .profile__bio p { margin: 0 0 .5rem; }
  .profile__bio p:last-child { margin-bottom: 0; color: var(--muted); }
</style></head><body><div class="page">
  <header class="profile">
    <div class="profile__avatar"><img src="$PROFILE" alt="Viktor Wardum holding a camera"></div>
    <h1 class="profile__name">Wardum</h1>
    <p class="profile__tagline">Photography — Reykjavik</p>
    <div class="profile__bio">
      <p>I photograph cities and the people in them — storefronts, signage, the light on a building at the wrong time of day.</p>
      <p>Based in Reykjavik.</p>
    </div>
  </header>
</div></body></html>
HTML

# --- Gallery ---------------------------------------------------------------
cat > "$BUNDLE/gallery.html" <<HTML
<!-- @dsCard group="Layout" -->
<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Gallery grid</title><style>
$TOKENS
  .page { max-width: var(--page); margin: 0 auto; padding: 24px var(--pad); }
  .gallery__title { margin: 0 0 1.1rem; font-size: .72rem; font-weight: 600; text-transform: uppercase; letter-spacing: .14em; color: var(--muted); }
  .grid { display: grid; grid-template-columns: 1fr; gap: var(--gap); align-items: end; }
  @media (min-width: 40rem) { .grid { grid-template-columns: repeat(2, 1fr); } }
  @media (min-width: 64rem) { .grid { grid-template-columns: repeat(3, 1fr); } }
  .tile { display: block; width: 100%; margin: 0; padding: 0; border: 0; border-radius: 3px; overflow: hidden; background: var(--tile-bg); cursor: zoom-in; }
  .tile img { width: 100%; height: auto; transition: opacity .2s ease; }
  @media (hover: hover) { .tile:hover img { opacity: .86; } }
</style></head><body><div class="page">
  <h2 class="gallery__title">Streets &amp; Structures</h2>
  <div class="grid">
    <button class="tile"><img src="$P1" alt="Four people walking a tree-lined path"></button>
    <button class="tile"><img src="$P2" alt="The glass dome of a conservatory"></button>
    <button class="tile"><img src="$P3" alt="A row of painted Victorian houses"></button>
    <button class="tile"><img src="$P4" alt="A taqueria on a street corner"></button>
    <button class="tile"><img src="$P1" alt="Four people walking a tree-lined path"></button>
    <button class="tile"><img src="$P2" alt="The glass dome of a conservatory"></button>
  </div>
</div></body></html>
HTML

# --- Lightbox --------------------------------------------------------------
cat > "$BUNDLE/lightbox.html" <<HTML
<!-- @dsCard group="Overlay" -->
<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Lightbox</title><style>
$TOKENS
  .lightbox { position: relative; height: 460px; display: grid; place-items: center; background: rgb(16 16 18 / .97); padding: clamp(.75rem,4vw,3rem); }
  .lightbox__stage { display: grid; place-items: center; max-width: 100%; max-height: 100%; }
  .lightbox__stage img { max-width: 100%; max-height: 340px; width: auto; object-fit: contain; }
  .lightbox__close, .lightbox__nav { position: absolute; border: 0; background: none; color: #f2f2f2; cursor: pointer; line-height: 1; opacity: .6; }
  .lightbox__close:hover, .lightbox__nav:hover { opacity: 1; }
  .lightbox__close { top: .5rem; right: .9rem; font-size: 2.6rem; padding: .25rem .5rem; }
  .lightbox__nav { top: 50%; transform: translateY(-50%); font-size: 3.2rem; padding: .5rem .9rem; }
  .lightbox__nav--prev { left: 0; } .lightbox__nav--next { right: 0; }
  .lightbox__counter { position: absolute; bottom: .9rem; left: 50%; transform: translateX(-50%); margin: 0; color: #9a9da2; font-size: .72rem; letter-spacing: .12em; }
</style></head><body>
  <div class="lightbox">
    <button class="lightbox__close" aria-label="Close">&times;</button>
    <button class="lightbox__nav lightbox__nav--prev" aria-label="Previous">&#8249;</button>
    <button class="lightbox__nav lightbox__nav--next" aria-label="Next">&#8250;</button>
    <div class="lightbox__stage"><img src="$P3" alt="A row of painted Victorian houses"></div>
    <p class="lightbox__counter">3 / 10</p>
  </div>
</body></html>
HTML

# --- Contact ---------------------------------------------------------------
cat > "$BUNDLE/contact.html" <<HTML
<!-- @dsCard group="Sections" -->
<!doctype html>
<html lang="en"><head><meta charset="utf-8"><title>Contact &amp; footer</title><style>
$TOKENS
  .page { max-width: var(--page); margin: 0 auto; padding: 0 var(--pad); }
  .contact { margin-top: 2rem; padding-top: clamp(1.75rem,4vw,2.5rem); border-top: 1px solid var(--rule); max-width: 36rem; }
  .contact p { margin: 0 0 .75rem; }
  .booking { font-size: 1.05rem; }
  .links { color: var(--muted); display: flex; flex-wrap: wrap; gap: .6rem; font-size: .95rem; }
  a { color: inherit; text-decoration: none; border-bottom: 1px solid #c4c7cb; padding-bottom: 1px; }
  a:hover { border-color: var(--fg); }
  footer { margin-top: clamp(3rem,8vw,5rem); padding: 1.5rem 0 2.5rem; color: var(--muted); font-size: .78rem; }
  footer p { margin: 0; }
</style></head><body><div class="page">
  <section class="contact">
    <p class="booking">Currently taking on a limited number of shoots — message me to book.</p>
    <p class="links"><a href="#">@wardumphotos</a><span>·</span><a href="#">viktorwardum@gmail.com</a></p>
  </section>
  <footer><p>© 2026 Viktor Wardum</p></footer>
</div></body></html>
HTML

echo "bundle written to $BUNDLE"
ls -la "$BUNDLE"
du -sh "$BUNDLE"
