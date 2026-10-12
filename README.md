# Town:Time v2 — the streets of the past

A full-screen historical explorer that works on GitHub Pages with **no application server**, database, user accounts, or paid API keys.

## Features

- Cinematic full-screen OpenStreetMap-powered map with location pins.
- Year scrubber (1860–2026): **filters dated records**; does not change the age of the modern map.
- Real, individually credited Hinckley archive photos and historically sourced local events.
- Immersive full-screen photo scenes, keyboard navigation, and a guided chronological journey.
- Interactive **then / later** slider comparing *two archival photographs* (different viewpoints may not align).
- Open corresponding places directly in Google Street View (Google website, no Google imagery mixed with OSM).
- Town search, geolocation, and geotagged Wikimedia Commons discovery.
- Local memories, favourites and export/import with browser storage.
- Responsive phone layout and optional gentle ambient audio.

## Publish to GitHub Pages

1. Create a **public** GitHub repository for `town-time`.
2. Copy `index.html`, `app.js`, `styles.css`, `data.js`, `.nojekyll`, and this README into the repository root.
3. In your repository: **Settings > Pages > Deploy from a branch > main / (root)**.
4. The site will become available at `https://YOURNAME.github.io/town-time/` once deployed.

All paths are relative, so project-style GitHub Pages URLs work.

If previewing locally, serve it with a static file server, e.g. `python -m http.server 8000` and browse to `http://localhost:8000`.

## File layout

- `index.html` — app shell, dialogs, accessible controls.
- `styles.css` — cinematic interface, responsive layouts, animations.
- `app.js` — map, interactions, API fetches, local storage, tour, and comparison.
- `data.js` — curated Hinckley starter records with source/attribution metadata.
- `.nojekyll` — disables Jekyll processing for GitHub Pages.

## Free services / operational notes

- OpenStreetMap tiles (public tile server fair-usage policy). For significant traffic, switch to a dedicated tile provider or self-hosted tiles.
- OSM Nominatim for searches (public-service fair usage, **not suitable for autocomplete**).
- Wikimedia Commons API for photo discovery and Commons `Special:FilePath` for images (subject to availability and re-use licences).
- Google Maps URLs only for optional Street View navigation; no Google API key.
- National Library of Scotland links for historic map reference (the app does not copy or embed their map tiles).
- Fonts and Leaflet downloaded at runtime from Google Fonts and unpkg. If those CDNs are unavailable, the site uses browser fallback fonts and shows an offline map notice. There is no offline geodata cache.

## Data integrity & legal

Photos are **not** automatically historic simply because Commons reports a location. Auto-discovered photographs remain explicitly *date unverified*. The curate-and-publish workflow should confirm capture dates, camera locations and licensing before adding any new images to `data.js`.

The present-day map is not historically reconstructed by the slider. Historic stories (e.g., Castle Street pedestrianisation) are labelled as approximations where precise dates are not verified. Photo comparisons are labelled as different camera viewpoints when appropriate.

Curated photo credit and licensing information are attached individually in `data.js`. Review each Wikimedia image source page for permissions before reuse. The app has no telemetry or tracking.

## Future enhancements

- Confirmed pre-1950 Hinckley photographs after rights and place/date research.
- Curated themes (lost railways, old shops, industry, wartime places).
- Opt-in community memory submissions would require an external service and moderation; current memories stay on the visitor's browser.
- A licensable historical map overlay only once terms and source are confirmed.
