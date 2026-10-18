# Seniors of NJ

The home for older adults in New Jersey.

- `src/` is the source: `index.html` (design and pages), `content/*.json` (all guides, counties, dates, glossary) and `img/` (photos).
- `site/` is the finished website, with one pre-rendered page per guide, county and topic, plus `sitemap.xml` and `robots.txt`.
- `scripts/build.sh` rebuilds `site/` from `src/`.

Netlify is connected to this repository and publishes `site/` automatically on every push to `main`.
