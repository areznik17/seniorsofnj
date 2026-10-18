# Seniors of NJ, working notes

Live site is published by Netlify from the `site/` folder on every push to `main`. No build runs on Netlify.

## How to make a change
1. Edit the source in `src/`: `index.html` holds all design and page templates; `content/*.json` holds the guides, counties, key dates, glossary and directory; `img/` holds photos (`img/sm/` are 640px copies).
2. Run `scripts/build.sh` to regenerate `site/` (it pre-renders every page with Playwright, writes sitemap.xml, robots.txt, 404.html, favicon). Set `DOMAIN=https://...` if the domain is not seniorsofnj.com.
3. Check pages at phone width, then commit both `src/` and `site/` and push to `main`.

## Owner's rules
- No em or en dashes in site copy. Copy should sound human.
- Nav: Home first, then topics. "Care Management" button links to https://www.caremanagementconnect.net (Lisa Kolton, the owner's mother). "Activities at Home" links to https://homehappenings.com.
- Email signup must not promise any schedule ("now and then" is fine). Do not ask readers for corrections.
- Every figure in a guide needs an official source and an updated date.
