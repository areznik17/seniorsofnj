# Fact-check and polish brief (Seniors of NJ)

Today is October 18, 2026. Read STYLE.md in this folder first; all its rules apply (no em or en dashes anywhere, human plain voice, no invented facts, people, quotes or stats).

For each article in your assigned JSON file(s):
1. Verify every specific claim against an official or reputable current source using WebSearch/WebFetch: dollar amounts, income limits, dates, deadlines, ages, phone numbers, program names, addresses, hours, prices, URLs. Prefer nj.gov, ssa.gov, medicare.gov, cms.gov, county .gov sites and the official site of any place named.
2. Fix anything wrong. If something cannot be verified, remove the specific figure and tell readers to call or check the official page instead. Do not leave stale or guessed numbers.
3. Check that every external link in the body and in `sources` loads (WebFetch). Replace or remove dead links.
4. Remove any mention of specific tennis or pickleball businesses, clubs, academies, apps or directories (for example Pickleheads). Generic advice (town recreation departments, county parks, YMCAs, senior centers) is fine.
5. If an article is under about 1,500 words, add useful, verified depth (a new section, worked example, checklist or more FAQs) to reach roughly 1,600 to 1,900 words. Do not pad.
6. Make sure each article has 4 to 6 FAQ items written as real questions people search for, with direct one to three sentence answers (these become FAQ rich results and help AI search).
7. Keep the exact JSON schema and slugs. Set "updated" to "2026-10-18" on every article you checked. Keep internal links in the form #/article/<slug> and only to slugs that exist in this folder.
8. Validate the JSON with python3 json.load, confirm no "—" or "–" characters remain, and keep "sources" accurate.

Reply with a short summary: what you corrected (old value to new value), anything you removed because you could not verify it, and new word counts.
