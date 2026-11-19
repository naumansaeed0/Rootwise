# Rootwise instrument design system

The shared language is an indoor-botany field instrument: catalogued specimens, fine keylines, ordinal readouts, restrained orbital geometry, and generous editorial typography. It builds on the home hero without changing `src/living-plant/`.

## Source of truth

- `src/styles/system.css`: reusable surface aliases, radius, spacing and typography scale, focus treatment, status colors, durations/easing, and foundational `.ui-*` primitives.
- `src/components/ui/Instrument.tsx`: `Panel`, `ReadoutLabel`, `PageIntro`, `SectionHeading`, `Meter`, `SafetyStatus`, and `ToggleGroup`.
- `src/components/ui/PlantReadouts.tsx`: shared specimen identity and plant readouts, used by collection cards, the table, and full records.
- `src/styles/instruments.css`: application layouts for the collection, record pages, editorial pages, navigation, and footer. It consumes the shared tokens and scopes overrides so the hero is preserved.
- `src/styles/main.css`: retained base/hero layout and existing color palettes. The new system aliases those palettes rather than replacing or duplicating them.

## Tokens

| Family         | Tokens                                                                                  | Purpose                                                         |
| -------------- | --------------------------------------------------------------------------------------- | --------------------------------------------------------------- |
| Surfaces       | `--ui-surface`, `--ui-surface-raised`, `--ui-line`                                      | Inherit `--panel`, `--panel-raised`, `--border`                 |
| Text           | `--ui-ink`, `--ui-secondary`, `--ui-mono`                                               | Main text, supporting readouts, technical font                  |
| Scale          | `--ui-space-1` … `--ui-space-5`, `--ui-type-label`, `--ui-type-body`, `--ui-type-title` | Shared spacing and type hierarchy                               |
| Shape          | `--ui-radius`, `.ui-panel--bracket`                                                     | Fine panel border and two small corner marks                    |
| State          | `--ui-safe`, `--ui-caution`, `--ui-unknown`, `--ui-focus`                               | Distinct safety states and focus treatment                      |
| Motion         | `--ui-duration-fast`, `--ui-duration-enter`, `--ui-ease`                                | Brief interactions and result entrance                          |
| Plant identity | Existing `--accent`, `--accent-ink`, `--art-*`                                          | Canopy, forest, desert, bloom; each retains light/dark variants |

Safety colors have separate light variants. Safety never depends on color alone: a check, exclamation mark, or question mark accompanies a text label. Do not replace these labels with dots. Meters are decorative representations of text, not inaccessible standalone ratings.

## Components

```tsx
<Panel as="section" className="my-section">
  <SectionHeading
    index="02"
    label="CARE PROTOCOL"
    title="Understand the conditions."
    text="A short explanation in plain language."
  />
</Panel>

<PageIntro
  index="03"
  label="ROOTWISE / EVIDENCE FILE"
  title={<>A little context.<em>A clearer picture.</em></>}
  description="Use one H1 for the page, and a short useful introduction."
  icon="leaf"
/>

<ToggleGroup
  label="Light"
  value={light}
  onChange={setLight}
  options={[{value: '', label: 'Any'}, {value: 'Low', label: 'Low'}]}
/>

<PlantReadouts plant={plant} />
<SafetyStatus value={plant.toxicity.pets} />
```

`ToggleGroup` uses a native fieldset/legend and real buttons with `aria-pressed`; it is not a custom imitation of a select. Buttons work with Tab, Enter, and Space. `PageIntro` emits the page H1; `SectionHeading` emits an H2. Keep heading order consistent in new sections.

## Specimen identity and readouts

`specimenCode(plant)` uses its **original dataset index**, never its current filtered position: Pothos is always `RW–001`. This avoids rewriting the protected botanical data. Reordering the dataset in a future content edit would change these codes; permanent independent IDs would require an explicit schema change.

Light is the existing four-level field, and care is the existing three-level difficulty field. Water labels summarize the existing `care.water` text using an explicit mapping of its seven instruction patterns. They are not guessed from category or inferred watering frequencies. An unknown pattern falls back to “See care record,” and the tests identify any currently unmapped record. The accompanying water bars are an ordinal visual hint about moisture guidance, not a measured hydration value. The full advice remains on each record.

All readouts are visible at rest on touch screens. Hover and keyboard focus receive the same border/illustration emphasis. No informational layer requires hovering.

## Layout and motion

Wide screens use a filter console beside a three-column collection; medium desktops use two columns. Tablets put the collapsible console above the collection. Narrow phones use one readable specimen per row. The table has a named, focusable horizontal-scroll region, keeping page-level overflow contained.

A result update animates the collection wrapper’s opacity and a four-pixel translation. The collection reserves at least one record row so empty results do not collapse the interface. Record order remains the original data order; there is no new sorting behavior. Reduced motion removes the new transitions and result animation.

Cards use solid/semi-opaque surfaces, borders, SVG, and a lightweight hover overlay. There is no card-level backdrop filter, heavy blur, pointer event loop, WebGL, or added animation package. `content-visibility: auto` lets Chromium defer offscreen card rendering; non-supporting browsers fall back to a regular grid.

## Accessibility boundary

Automated audits cover the new components in both modes, all four plant palettes, responsive layouts, expanded/collapsed filters, and the table. They do not prove conformance. Raw reports retain incomplete/manual-review results.

The existing protected hero contains one desktop `label-content-name-mismatch`: the visible ROOTS tag is not included in the accessible name “Start beneath the surface: open information panel.” Its source and behavior were left unchanged under the hard constraint. The test suite explicitly allows only this exact existing target/rule on the home page and continues to fail on new violations; it does not disable that rule globally.
