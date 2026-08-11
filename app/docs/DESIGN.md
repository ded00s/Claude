# My Future Pension — design system

A concept for the digital transformation of the Pension Fund of the Republic of
Uzbekistan. This document records the decisions the interface is built on, in the
order they were made: information architecture first, then the visual language,
then the component hierarchy.

> **Unofficial.** Not affiliated with, endorsed by, or operated by any state body.
> All data in the product is fictional and every calculation is illustrative.

---

## 1. The design problem

A pension platform is not a banking app, and copying one would be a mistake.

| Banking app | Pension platform |
| --- | --- |
| Balance is a fact | Projection is a model output |
| Daily use | Opened a few times a year, or once a decade |
| User acts on the money now | User acts on a decision that pays off in 20 years |
| Trust comes from responsiveness | Trust comes from transparency and consistency |

Three consequences shaped everything below:

1. **Every number is a projection, and must look like one.** Forecasts are drawn
   as ranges, not lines. The word "illustrative" appears wherever a figure does.
2. **The interface must survive being wrong.** If a projection changes next year,
   a citizen should feel informed, not deceived. So the arithmetic is published
   in the product itself (`SimulatorView → How this projection is calculated`).
3. **Nobody reads a pension dashboard for pleasure.** The five-second layer has to
   carry the whole answer; everything else is for the person who wants to dig.

---

## 2. Information architecture

Two audiences, deliberately separated — a citizen and a fund analyst want opposite
things from the same data.

```
My Future Pension
│
├── My pension            (citizen · default view)
│   ├── Hero              How much, from what, when          ← the 5-second layer
│   ├── Pension forecast  Entitlement vs. retirement age
│   ├── Readiness         How complete the record is
│   ├── Insights          What the record shows, what to do
│   ├── Timeline          The record itself, period by period
│   ├── Contributions     Last 12 months of filings
│   └── Actions           Every service, in one place
│
├── What if?              (citizen · addressable, linkable)
│   ├── Simulator         5 levers → live comparison
│   ├── Pension forecast  Re-rendered against the live scenario
│   └── How it's calculated  The full arithmetic
│
└── Fund analytics        (staff)
    ├── KPI band          National position in one scan line
    ├── Revenue vs. expenditure   The structural gap
    ├── Support ratio + age structure
    ├── Regional distribution     Schematic cartogram
    └── Revenue mix + outlook     Interpretation, labelled as such
```

**Reading order is importance order.** On the citizen view the projected figure is
the largest element on the page by a factor of three, and the four supporting
numbers sit in one scan line beneath it. A citizen who reads nothing else has the
answer.

**Views are addressable** (`#citizen`, `#simulator`, `#admin`) so a caseworker can
send a link straight to the simulator, and the browser back button behaves.

---

## 3. Colour

Derived from the Uzbek state colours — deep blue, white, green — held at
institutional saturation rather than flag saturation.

| Role | Light | Dark | Meaning |
| --- | --- | --- | --- |
| `--primary` | `#123c78` | `#5b94e0` | Structure, navigation, the current path |
| `--accent` | `#0e7f52` | `#34bc82` | Growth, positive delta, confirmation |
| `--warning` | `#b45309` | `#e59b3d` | Attention — contribution gaps |
| `--danger` | `#b42318` | `#f0705f` | Errors and destructive actions only |

**Green is rationed.** It appears only where something has grown or been
confirmed. A pension record with no green in it is not a failing record, and the
palette never implies otherwise.

**A contribution gap is amber, never red.** A missing filing is usually an
employer's administrative error. Colouring it red would blame the citizen for
something they did not do.

### Contrast

Every foreground/background pair is measured, not eyeballed. `node contrast-check.mjs`
asserts the ratios and exits non-zero on regression:

```
light: body text on surface     17.23:1
light: muted text on surface     6.86:1
light: subtle text on surface    5.18:1
light: primary text on surface  10.81:1
dark:  body text on surface     15.24:1
dark:  muted text on surface     7.98:1
dark:  subtle text on surface    5.54:1
```

All three foreground levels clear WCAG AA body text (4.5:1) against *all three*
background levels — surface, page and inset — because all three are used on all
three.

---

## 4. Typography

**IBM Plex Sans** for everything, **IBM Plex Mono** reserved for nothing but
tabular figures. One superfamily, self-hosted, no network dependency.

IBM Plex was chosen over a geometric grotesque for two specific reasons: it was
designed for dense data UI and holds up at 11px, and it ships a complete Cyrillic
set — non-negotiable when the currency renders as `сўм`.

Type scale is a 1.200 minor third anchored at a 15px body:

| Token | Size | Use |
| --- | --- | --- |
| `text-5xl` | 52px | The single hero projection |
| `text-3xl` | 32px | Page titles |
| `text-2xl` | 26px | Secondary figures |
| `text-base` | 15px | Body |
| `text-sm` | 13px | Supporting text, table cells |
| `text-xs` | 12px | Labels, captions |
| `text-2xs` | 11px | Dense metadata only |

**All financial figures use `.tabular`** (`font-variant-numeric: tabular-nums`).
Money that does not align in a column is money that is hard to compare.

---

## 5. Spacing and elevation

Dashboard density: an 8px base with a 4/8/12/16/20/24 rhythm. Cards are `p-5` at
mobile, `p-6` from `sm`, `p-8` for the hero only.

**Depth comes from borders first, shadow second.** Three elevation levels exist and
two of them are nearly invisible. A government service that looks like it is made
of floating glass cards does not look like it holds your pension record.

Radii: `10px` cards, `8px` controls. Deliberately modest — the brief's "huge
rounded cards" are exactly the consumer-app tell to avoid.

---

## 6. Motion

One entrance animation (`rise`, 320ms), one fade (200ms), and 150ms state
transitions. Nothing loops, nothing parallaxes, nothing animates on scroll.

`prefers-reduced-motion: reduce` collapses all of it to 0.01ms — and the count-up
hook checks the same query and jumps straight to the final value, because a number
is information and information must never be withheld for the sake of motion.

---

## 7. Data visualisation

Rules applied to every chart in the product:

1. **Never colour alone.** The current path is solid, the optimised path is dashed,
   and the legend says so in words: "Current path (solid)", "Optimised path (dashed)".
2. **Uncertainty is drawn.** The forecast band widens ~1.4%/year out, capped at 28%.
   A single confident line 25 years out would be a lie.
3. **Projections are shaded and labelled** — `ReferenceArea` plus the word
   "Projected", on both the citizen forecast and the fund's revenue chart.
4. **Every chart has a non-visual equivalent.** The forecast has a real data table
   one keypress away; the others carry `sr-only` summaries with actual figures.
5. **Tooltips are one component.** Hover feedback is identical everywhere.

### The regional map is not a map

It is a **tile cartogram**: 14 equal tiles, positioned to echo geography
(Karakalpakstan west, the Fergana valley east, Surkhandarya south) but explicitly
not a projection. Equal tiles mean Sirdaryo is as readable as Karakalpakstan,
which a real choropleth would visually erase. The card says "this is a schematic,
not a map" in the description.

The colour ramp stops at 48% rather than running to full primary. A fuller ramp
would force the label colour to flip part-way up the scale, and any
threshold-based flip fails contrast for tiles either side of the switch. Capping
it keeps one label colour legible across the whole range in both themes — and the
encoding is redundant anyway, because every tile prints its own value.

---

## 8. Pension readiness — the responsible-design constraint

The brief asked for a 0–100 score and explicitly not a credit score. That
distinction is enforced in the design, not just the wording:

| A credit score | Pension readiness |
| --- | --- |
| Ranks you against others | Measures only your own record's completeness |
| Shared with third parties | Shared with nobody — stated in the card |
| Gates access to products | Gates nothing |
| Driven by history you can't change | Every factor is one you can still influence |
| Lowest band is a judgement | Lowest band is "Getting started" |

The four factors are weighted toward what remains actionable: contribution history
(30), consistency (25), projected adequacy (25), years remaining (20). Each states
what it measured *and* what would move it. The arc is a progress indicator; the
number carries the meaning and is exposed to assistive tech as
`role="img"` with a full label, while each factor bar is a `role="meter"`.

---

## 9. Accessibility

Verified, not asserted — `node a11y-check.mjs` runs axe-core across all three views
in both themes and reports **0 WCAG 2.1 A/AA violations**.

- Semantic landmarks; every card is a `<section>` with a heading, in outline order.
- Skip link to `#main`.
- Focus rings never removed — only replaced where a control draws its own.
- 44px minimum hit target on every control (`min-h-11`), independent of visual size.
- Icon-only buttons carry `aria-label`; decorative SVG is `aria-hidden`.
- Abbreviated figures ("9.04 mln") carry the exact value via `aria-label`.
- Charts have table or `sr-only` equivalents.
- Theme respects `prefers-color-scheme`, applied before first paint to avoid a flash.
- No horizontal scroll at 320px on any view (asserted in `shot.mjs`).

---

## 10. Component hierarchy

```
components/
├── ui/               Primitives — no domain knowledge
│   ├── Card, Button, Badge, Stat
│   ├── Slider              native range, restyled
│   ├── SegmentedControl    radiogroup semantics
│   └── ChartTooltip        shared tooltip + legend
├── layout/
│   ├── AppShell      header, nav, theme toggle, footer
│   ├── DemoBanner    permanent, non-dismissible disclosure
│   └── Logo
├── citizen/          Hero, ForecastChart, Simulator, Timeline,
│                     Readiness, Insights, Actions, ContributionStrip
└── admin/            RegionalMap, FlowChart, Demographics
```

`lib/pension.ts` holds the entire model. No component computes a pension; they all
call `projectScenario`. This is why the insight percentages are derived rather
than written — hand-typed copy drifts away from the model the moment either
changes.

---

## 11. Honest limitations

- **The model is a teaching model.** It is deliberately more legible than the
  statutory formula and is calibrated to land in the realistic 40–50% replacement
  range, but it is not the Fund's formula and cannot establish an entitlement.
- **The data is synthetic.** Proportioned to resemble published national
  statistics so chart shapes can be judged, but invented.
- **There is no backend.** No authentication, no persistence, no submission. The
  citizen actions are presentational.
- **Uzbek and Russian localisation is not implemented.** The interface is English
  with local currency formatting. A real deployment would need all three, and the
  layout has been kept flexible for the ~30% string growth that Russian brings.
