# Seniors of NJ, working notes

Live site is published by Netlify from the `site/` folder on every push to `main`. No build runs on Netlify.

## How to make a change
1. Edit the source in `src/`: `index.html` holds all design and page templates; `content/*.json` holds the guides, counties, key dates, glossary and directory; `img/` holds photos (`img/sm/` are 640px copies).
2. Run `scripts/build.sh` to regenerate `site/` (it pre-renders every page with Playwright, writes sitemap.xml, robots.txt, 404.html, favicon). Set `DOMAIN=https://...` if the domain is not seniorsofnj.com.
3. Check pages at phone width, then commit both `src/` and `site/` and push to `main`.

## Owner's rules
- No em or en dashes in site copy. Copy should sound human.
- Nav: Home first, then topics. Only one header button, "Activities at Home" (homehappenings.com, disabled until launch). No Care Management button in the header; Connections Care Management (https://www.caremanagementconnect.net, Lisa Kolton, the owner's mother) is listed first (no Featured tag) on the Find care help pages (/find-help/, data in src/content/pros.json).
- New pages: town guides (/town/<slug>/, src/content/towns.json; they show a Home Happenings promo that stays unlinked until HH_LIVE) and Spanish guides (/es/<slug>/, src/content/es.json, each with an "en" slug; English guides show a "Leer en español" link).
- Images: square or horizontal crops only, never tall vertical.
- Share thumbnails: every page gets its own 1200x630 card (logo, page headline, page photo) made by scripts/og_cards.js during the build and cached in src/img/og/p (manifest.json). Commit them. The home card uses the couple-walking photo and no subline.
- Mobile: nothing may ever scroll sideways. Filter buttons wrap (short labels on phones), fact tables stack into cards on phones. After layout changes, check every sitemap page at 360px and 390px for horizontal overflow.
- Find care help: Connections Care Management stays first (featured:true is only a sort key) but shows no Featured tag and is not named in the page disclaimer. Only add providers whose name, phone and site were confirmed on their own site or a government site.
- No email signup (removed at the owner's request; newsletter() returns nothing). Do not ask readers for corrections.
- Every figure in a guide needs an official source and an updated date.

## Home Happenings launch checklist (do this when the owner says Home Happenings is live)
- In `src/index.html` set `HH_LIVE=true`. That turns on every homehappenings.com link (the "Activities at Home" button is a non-working "Coming soon" button until then) and shows the Home Happenings promo on county pages listed in `HH_COUNTIES` (currently Essex and Passaic).
- HH_LIVE also turns on the Home Happenings ad cards (hhAd in src/index.html): one inside each guide after the third section plus a desktop sidebar card (not on Benefits or Housing guides, scams, elder abuse or estate planning, or Spanish pages), a band on the home page, on the Living Well, Things to Do and Caregiving topic pages, and at the end of the Find care help list. Update HH_AREA if the service area changes.
- Three guides (activities-for-homebound-seniors-nj, activities-for-dementia-nj, gift-ideas-older-parents-nj) describe Home Happenings as "launching soon". At launch, change that sentence to present tense and match the real service area.
- Lead tracking: with HH_LIVE on, hhTag() adds utm_source=seniorsofnj, utm_medium=referral, utm_campaign=<page type>, utm_content=<placement> and utm_term=<page slug> to every homehappenings.com link. Home Happenings must keep those parameters through booking (store first-touch UTM on the booking) to count leads.
- Add any newly served counties to `HH_COUNTIES`, and consider adding Home Happenings mentions to relevant guides (learn-something-new, staying-connected-nj, caregiving guides).
- Rebuild with `scripts/build.sh`, check pages, push to `main`.

## Time-sensitive updates (weekly scheduled task does this)
- The home page "spotlight" card comes from `spotlight` in `src/content/extras.json`; the first item whose `until` date hasn't passed is shown. Keep at least two future items in the list.
- Watch for: 2027 Medicare Part B premium and deductible (CMS, usually mid November), Stay NJ/ANCHOR/Senior Freeze dates and payment news (NJ Treasury), LIHEAP and Lifeline season dates (NJ DCA), new PAAD/Senior Gold and HAAAD hearing aid income limits (January), VA pension rates and net worth limit (December 1, veterans guide), Social Security and SSI figures, county golf fees (spring), and dates in `extras.json` key dates. Update every guide that mentions a changed figure and its `updated` date; cite the official source.
- Validate JSON, no em or en dashes, rebuild, check structured data parses, commit and push.
