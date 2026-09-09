# wardumphotos.is — Build Plan

## Overview
A minimalist personal photography portfolio site for Viktor Wardum, a portrait/street photographer based in Reykjavik. Site should feel clean, fast, and personal (not templated or agency-like). Primary goal: showcase 10–15 photos and make it dead simple for someone to reach out and book a shoot.

## Site Goals
- Fast-loading, minimal, image-forward
- Fully static (no CMS, no database, no e-commerce)
- Mobile-first — most traffic will come from an Instagram bio link on phones
- Easy for Viktor to update photos over time without touching much code

## Pages / Structure
Single-page site (or very close to it) is preferred over multi-page for this scope.

1. **Hero section**
   - Large hero image (Viktor's strongest portfolio shot, or a photo of him taken by someone else — NOT a mirror selfie)
   - Name/brand: "Wardum" or "Wardum Photos"
   - One-line bio: e.g. "Portrait & street photography — Reykjavik"

2. **Gallery**
   - 10–15 photos, grid or masonry layout
   - Should show range: a few tight portraits, a few environmental/full-body, varied lighting
   - Lightbox/enlarge-on-click behavior (simple, no heavy library needed)
   - Lazy-load images for performance

3. **About (short, can be part of hero or its own small section)**
   - 2–3 sentences max. Who he is, what he shoots, based in Reykjavik.

4. **Contact / Booking**
   - No pricing listed yet (phase 1 strategy — pricing comes later once portfolio is established)
   - Line: "Currently taking on a limited number of shoots — message me to book."
   - Contact via Instagram DM link and/or simple mailto: link
   - Optional: simple contact form (name, email, message) — only if easy to implement without a backend (e.g. mailto fallback or a static form service like Formspree)

## Design Direction
- Minimalist, generous whitespace, large images
- Dark background suits photography portfolios well (photos pop), but open to clean/bright alternative — decide based on the actual photo selection's tone
- Typography: one clean sans-serif for UI text, let photos be the visual focus
- No unnecessary animations or templated "agency" feel
- No stock icons/graphics — keep it personal and simple

## Technical Requirements
- **Stack:** Plain HTML/CSS/JS (or a minimal static site generator like Astro/11ty if it speeds things up) — avoid heavy frameworks, this doesn't need React for a static portfolio
- **Images:** Export/compress all photos to web-friendly size (max ~2000px on the long edge, optimized JPEG/WebP) before adding to the repo
- **Responsive:** Must look good on mobile first, then scale up to desktop
- **Performance:** Lazy-load gallery images, keep total page weight reasonable
- **No backend/database** — fully static site

## Content Checklist (Viktor to provide before/during build)
- [ ] 10–15 final selected photos, exported at web resolution
- [ ] Hero image chosen
- [ ] Final bio line
- [ ] Final contact/booking line
- [ ] Instagram handle to link
- [ ] Contact email (if using mailto or a form)

## Hosting & Deployment Plan
Site will be self-hosted on Viktor's Raspberry Pi 5 (already running Jellyfin), reachable publicly via Cloudflare Tunnel (not Tailscale — Tailscale is private-network-only and won't serve public visitors).

Steps:
1. Build and test the static site locally first
2. Set up a reverse proxy on the Pi (Caddy recommended for automatic HTTPS and simplicity, nginx as an alternative) to serve the site on its own port, separate from Jellyfin
3. Set up a **Cloudflare Tunnel** on the Pi to expose the site publicly without port forwarding or exposing the home IP
4. Point the `wardumphotos.is` domain's DNS to Cloudflare (Cloudflare becomes the DNS provider), and route the tunnel through it
5. Confirm SSL/HTTPS is working automatically via Cloudflare
6. Use existing Tailscale setup for admin/remote access (SSH in from Stanford to deploy updates) — keep this separate from the public-facing tunnel
7. Test the live site from an external network (e.g. phone on cellular data, not on Tailscale/home wifi) to confirm public reachability

## Launch Checklist
- [ ] Test full site on mobile browser
- [ ] Confirm all photos load correctly and lightbox works
- [ ] Confirm contact/booking link works (Instagram + email)
- [ ] Confirm site is reachable from an external network (not just home wifi/Tailscale)
- [ ] Add wardumphotos.is link to Instagram bio
- [ ] Final proofread of all text (bio, contact line, alt text on images)

## Future Phase (not part of initial build)
- Add pricing page once 5–10 real paid/portfolio-building sessions are completed
- Possibly expand to multi-page if content grows (e.g. separate galleries by category: portraits, street, events)
