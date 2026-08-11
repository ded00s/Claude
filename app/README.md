# My Future Pension

An interactive concept for a citizen-facing pension platform and an internal
analytics dashboard, built as a design proposal for the digital transformation of
the Pension Fund of the Republic of Uzbekistan.

> ### Unofficial design concept
>
> This is **not** an official product. It is not affiliated with, endorsed by, or
> operated by the Pension Fund of the Republic of Uzbekistan or any other state
> body. Every name, employment record, salary and national statistic in this
> repository is **fictional**, and every calculation is **illustrative** — the
> projection model is a simplified teaching model, not the statutory pension
> formula, and it cannot be used to establish, calculate or dispute an
> entitlement.

## What it contains

**Citizen — "My pension"**
A five-second answer to *how much, from what, and when*, then the record it rests
on: an interactive forecast of entitlement against retirement age with a drawn
uncertainty band, a pension-readiness breakdown, derived insights, an interactive
contribution timeline including a flagged gap, and every citizen service in one
place.

**Citizen — "What if?"**
Five levers — salary, years contributed, salary growth, voluntary top-up,
retirement age — driving a live current-vs-simulated comparison, with the full
arithmetic of the model published beneath it.

**Staff — "Fund analytics"**
National KPIs, the revenue/expenditure gap with projections shaded, the
contribution-to-benefit ratio against a planning threshold, age structure, a
schematic regional cartogram with three switchable metrics, revenue mix, and a
written outlook that separates observation from recommendation.

## Running it

```bash
npm install
npm run dev        # development server
npm run build      # production build
npm run preview    # serve the production build
```

## Verification

The concept ships with the checks used to validate it:

```bash
npx tsc -b --noEmit      # types
node contrast-check.mjs  # WCAG contrast ratios for every token pair
node a11y-check.mjs      # axe-core, 3 views × 2 themes   (needs preview running)
node shot.mjs            # screenshots + 320px overflow check (needs preview running)
```

Current state: **0 type errors**, **all contrast pairs pass**, **0 WCAG 2.1 A/AA
violations**, no horizontal overflow at 320px, no console errors.

## Stack

React 19 · TypeScript · Tailwind CSS v4 · Recharts · Lucide · Vite

Fonts (IBM Plex Sans / Mono) are self-hosted, so the interface renders identically
offline and makes no third-party requests.

## Design documentation

[`docs/DESIGN.md`](docs/DESIGN.md) records the information architecture, colour
and type systems, motion rules, data-visualisation constraints, the
responsible-design reasoning behind the readiness score, and the concept's honest
limitations.

## Licence

MIT.
