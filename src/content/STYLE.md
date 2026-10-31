# Seniors of NJ — writing brief for long-form articles

Site: Seniors of NJ, an independent resource and magazine for New Jersey residents 60+ and their adult children. Not a government agency. Today is October 15, 2026.

## Voice
- Warm, plain, confident. Like a knowledgeable neighbor who used to work at the county office on aging.
- Short sentences (aim under 22 words). Active voice. Key point first. Spell out acronyms on first use.
- Write like a human journalist. NO em dashes or en dashes anywhere (use commas, periods, parentheses or "to" for ranges). No "not X, but Y" constructions, no "It's worth noting", no "In conclusion", no "Let's dive in", no rhetorical colon reveals, no emoji.
- Question-style H2 headings are good ("Who qualifies?", "How do I apply?").
- Use specific NJ details: real program names, real phone numbers, real places, towns, counties.

## Accuracy (critical)
- Every figure (income limits, dollar amounts, dates, phone numbers, ages) must be verified with WebSearch/WebFetch against an official or reputable current source. Prefer nj.gov, ssa.gov, medicare.gov, cms.gov, county .gov sites.
- If you cannot verify a number, leave it out and tell the reader to call or check the official page.
- Never invent statistics, quotes, people, testimonials or events. No fake reader stories. You may write hypothetical examples clearly framed ("Say you are a widow in Toms River with...").
- Put every source you relied on in `sources`.

Known verified facts you may use (checked Oct 2026):
- PAS-1 (combined Property Tax Relief application for ANCHOR, Senior Freeze, Stay NJ) deadline: November 2, 2026. Hotline 1-888-238-1233. Senior Freeze info line 1-800-882-6597.
- ANCHOR 2025: homeowners <=$150k $1,500; $150,001–$250k $1,000; renters <=$150k $450 (under 65) / $700 (65+).
- Senior Freeze 2025: 65+ by Dec 31 2025 or SS disability; owned & lived in home since Dec 31 2022; income limits $168,268 (2024) and $172,475 (2025).
- Stay NJ: homeowners 65+, 50% of property taxes after ANCHOR & Senior Freeze, caps $6,500 (income <=$100k), $5,000 ($100,001–150k), $4,000 ($150,001–200k); paid in 4 installments.
- PAAD: income under $54,943 single / $62,390 married; copay $5 generic / $7 brand. Senior Gold: $54,943–$64,943 single / $62,390–$72,390 married; $15 + 50% of remaining cost. Phone 1-800-792-9745. Lifeline utility assistance $225/yr, same income rules.
- SHIP Medicare counseling 1-800-792-8820. Senior Medicare Patrol 1-732-777-1940 ext. 1117. ADRC statewide 1-877-222-3737. NJ 211: dial 2-1-1 or 1-800-510-3102.
- LIHEAP/USF/Weatherization: one application, income <= 60% of NJ state median income; one-person limit $51,273 (FFY2027); applications Oct 1 2026–June 30 2027.
- 2026 Medicare: Part B premium $202.90/month, Part B deductible $283, Part A deductible $1,736. Open enrollment Oct 15–Dec 7.
- Social Security 2027 COLA: 3.6% (announced Oct 14, 2026), avg retired worker $2,095 -> $2,170 in Jan 2027. Earnings test under FRA $25,560; year reaching FRA $67,920.
- NJ State Parks: NJ residents 62+ can get a free Senior Citizen Pass (free entrance), at any park office. Info 1-800-843-6420.
- NJ Transit: reduced fares for riders 62+.

## Length & shape
- Each article 1,400–2,000 words of body text. Real depth: examples, steps, what to bring, common mistakes, what happens next.
- 4–7 H2 sections. Use <h2>, <h3>, <p>, <ul>/<ol>, <strong>, <a href> (official links, target="_blank" rel="noopener"), and these optional blocks:
  - <div class="callout"><strong>Title</strong><p>text</p></div>
  - <div class="steps"><ol><li><strong>Step title.</strong> detail</li></ol></div>
  - <table class="facts"> with <thead>/<tbody> for figures.
  - <aside class="pull">One short line worth pulling out (your own words).</aside>
- Phone numbers wrapped as <span class="tel">1-800-...</span>.
- Internal links to other site articles use href="#/article/<slug>" (only slugs from the master list below).

## Output format
Write ONE JSON file (UTF-8, valid JSON, validate with `python3 -c "import json;json.load(open(path))"`) containing an array of article objects:
{
 "slug": "kebab-case",
 "title": "Headline (sentence case, under 75 chars)",
 "dek": "One or two sentence standfirst.",
 "hub": "benefits" | "health" | "caregiving" | "home" | "things-to-do" | "living",
 "kind": "guide" | "feature" | "list",
 "tags": ["2-4 short tags"],
 "photo": "<one photo key from list>",
 "updated": "2026-10-15",
 "keyFacts": ["3-5 short bullet facts for a sidebar box"],
 "body": "<p>...HTML...</p>",
 "faq": [{"q":"...","a":"..."}],   // 3-5 items
 "sources": [["Title","https://..."]]
}

## Photo keys (pick the best fit; you may reuse)
shore-lighthouse, boardwalk, beach-dunes, autumn-trail, lake, pine-barrens, skyline-river, main-street, farm-market, garden, kitchen, piano, painting, couple-walking, grandparent-child, friends-coffee, yoga, doctor, pharmacy, paperwork, video-call, phone-call, porch, moving-boxes, volunteers, museum, train, library, birds, knitting, cards-chess, dog-walk, hands-holding, home-exterior

## Master slug list (for internal links)
property-tax-relief-nj, prescription-and-bill-help, social-security-2027, food-and-utility-help, medicare-turning-65, advantage-vs-medigap, medicaid-mltss-nj, healthy-aging-nj, first-conversation-about-care, caregiver-respite-nj, aging-in-place-nj, estate-planning-nj, free-and-discounted-nj, day-trips-nj, learn-something-new, staying-connected-nj, scams-nj

## Audience research (added Oct 31, 2026)
Aaron's interviews (Home Happenings project: discovery-notes.md) shape every new page:
- The person searching is often the adult child (usually a daughter) or a spouse. Speak to them too ("your mom or dad"), and add at least one FAQ phrased the way a family member would search.
- Say "older adults" in body copy, never "elderly". Many readers don't think of themselves as seniors.
- Trust and safety come first: vetting, background checks, insurance, references, scams, never handing over checkbooks. Include practical checks whenever a page involves someone coming into the home.
- Frame benefits as outcomes families care about: staying safe at home, avoiding falls, staying sharp, seeing people, "something to look forward to every week". Many people stop what they love only because they can no longer get there.
- Key moments: after surgery or rehab, after giving up driving, when a spouse needs care.
- When sharing interview findings (e.g., typical private lesson prices of about $60 to $150 an hour in North Jersey), say they come from our October 2026 conversations, and never name private people.
