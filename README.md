# Town:Time

A photo-first historical explorer for Hinckley, published as a static GitHub Pages site.

## What the site does

- Leads with individually credited, dated archive photographs.
- Separates historical stories into their own clearly labelled view; stories are never given invented period imagery.
- Filters records with one explicit “up to year” timeline.
- Provides then-and-now sliders only where two dated archive photographs exist.
- Maps records on a present-day OpenFreeMap/MapLibre map, with visible source attribution.
- Replaces the map with a readable archive-first fallback if the map library or service fails.
- Adapts to desktop and phone layouts without fixed side rails.

## Data and image integrity

Curated records are in `data.js`. Every photograph includes a Wikimedia Commons filename, creator, licence, stated date, and location-accuracy note. The interface links to the original Commons file page. Town:Time does not generate historical photographs.

Historical stories include their own text source and are visually identified as `HISTORICAL STORY · NO PERIOD PHOTO`. Approximate dates are labelled as approximate.

The map is a modern reference map, not a reconstruction of past streets. The timeline filters archive records only.

## Services and attribution

- Vector map: [OpenFreeMap](https://openfreemap.org/) using its documented MapLibre style. OpenFreeMap/OpenMapTiles/OpenStreetMap attribution is supplied by the style and MapLibre attribution control.
- Archive images: [Wikimedia Commons](https://commons.wikimedia.org/), with per-image creator and licence metadata in the interface.
- Historical story sources: linked per record.

OpenFreeMap is an external public service without an SLA. The application detects startup/source failure and removes the map canvas rather than leaving broken map fragments. Archive browsing continues to work.

## Local preview

Serve the repository root with any static web server and open `index.html` through that server. Direct `file://` loading is not recommended because browsers may restrict external requests.

## Publishing

GitHub Pages should deploy from `main` at the repository root. `.nojekyll` is included.
