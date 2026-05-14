# Content Conventions

How to write, edit, and update content on the Ghostworks site.

---

## Voice

**Direct and technical.** Ghostworks documents real research with real measurements. The site should sound like the researcher would speak — precise, confident, no marketing fluff.

| Use | Avoid |
|---|---|
| "GNW is a drive-based cognitive architecture." | "GNW is a revolutionary AI breakthrough that..." |
| "Round 39 reached 92.7% success ratio." | "Incredible results from our cutting-edge system!" |
| "The system detects its own saturation." | "Self-aware AI that knows when it's done!" |
| Specific numbers, names, and thresholds | Vague claims and superlatives |

If a sentence could appear in a SaaS landing page template, rewrite it.

---

## Page Anatomy

Every primary page follows the same shape:

1. **Hero** — `<Hero>` component with eyebrow + title + subtitle
2. **One or more sections** — wrapped in `<section class="container-content pb-16">`
3. **Section headers** follow the `eyebrow / heading` pattern:
   ```astro
   <div class="mb-8 space-y-2">
     <p class="font-mono text-2xs uppercase tracking-wider text-fg-subtle">Section Name</p>
     <h2 class="text-2xl font-medium tracking-tight">Section title.</h2>
   </div>
   ```
4. **Final section** uses `pb-24` instead of `pb-16` for the footer breathing room

---

## Capitalization

- **Headings:** sentence case ending with a period. ("How GNW and GRAO work together.")
- **Eyebrows:** UPPERCASE with letter-spacing (handled by the `uppercase tracking-wider` classes). Use 1–3 words. ("Frameworks", "The Loop", "Live Data")
- **Buttons:** sentence case, no terminal punctuation. ("Explore the research")
- **Tags / badges:** UPPERCASE monospace.

---

## Numbers and Units

Always specific. Always with units or context.

| Good | Bad |
|---|---|
| "0.50 threshold" | "moderate threshold" |
| "6 cycles" | "a few cycles" |
| "92.7% success ratio" | "very high success" |
| "20 consecutive rounds" | "many rounds" |

Decimals: keep two places for thresholds (`0.85`), one for percentages (`92.7%`).

---

## Linking to the Research Repo

Use the `PUBLIC_GITHUB_REPO` environment variable, never hardcode the URL.

```astro
---
const githubRepo = import.meta.env.PUBLIC_GITHUB_REPO ?? 'https://github.com/Nitestalkr/Remnant-Research';
---

<a href={`${githubRepo}/tree/main/gnw`} target="_blank" rel="noopener noreferrer">
  Read the full specification ↗
</a>
```

External links should:
- Open in a new tab (`target="_blank"`)
- Include `rel="noopener noreferrer"`
- End with an `↗` arrow to indicate external

Internal links should:
- Open in the same tab (no `target` needed)
- End with a `→` arrow if they're a CTA, or no arrow for inline links

---

## When the Research Updates

The research repo is the canonical source of truth. When a value changes there, mirror it here.

Files to keep in sync:

| Site location | Source of truth |
|---|---|
| `research/gnw.astro` — drives table | `gnw/docs/PARAMETER-VALUES.md` in research repo |
| `research/gnw.astro` — boredom formula | `gnw/cognitive-cycle/BOREDOM-FORMULA.md` |
| `research/grao.astro` — progression table | `tpg-grao/README.md` round table |
| `research/grao.astro` — gradient formula | `tpg-grao/grao/gradient-derivation.md` |
| `index.astro` — research card metrics | Both READMEs combined |

When the research repo lands an update that affects on-site numbers, update the page frontmatter (the arrays at the top of `.astro` files) — don't touch the markup below.

---

## Adding a New Section to an Existing Page

Pattern to follow (copy from `index.astro` or `research/gnw.astro`):

```astro
<section class="container-content pb-16">
  <div class="mb-8 space-y-2">
    <p class="font-mono text-2xs uppercase tracking-wider text-fg-subtle">Eyebrow</p>
    <h2 class="text-2xl font-medium tracking-tight">Section heading.</h2>
  </div>

  <!-- Section content here -->
</section>
```

For sections that need visual emphasis (e.g. the loop description on the landing page), use the panel pattern:

```astro
<section class="container-content pb-16">
  <div class="rounded-lg border border-border bg-bg-subtle p-8 sm:p-10">
    <!-- Content -->
  </div>
</section>
```

---

## Adding a Blog or Updates Section

Not yet implemented. When the time comes:

1. Create `src/content/config.ts` with a Content Collection schema for `blog`
2. Add `src/content/blog/*.md` files with consistent frontmatter (`title`, `pubDate`, `description`, `draft`)
3. Create `src/pages/blog/index.astro` (list) and `src/pages/blog/[...slug].astro` (entry)
4. Add a nav link in `Header.astro`

Reference: https://docs.astro.build/en/guides/content-collections/

---

## Accessibility Reminders

- Every image needs alt text. Decorative SVGs use `aria-hidden="true"`.
- Color is never the only signal — pair color changes with text or icons.
- Headings descend in order (`h1` → `h2` → `h3`). Don't skip levels for visual sizing.
- Interactive elements are keyboard-reachable and have visible focus states.
- Link text is descriptive ("Read the full specification") not generic ("Click here").
