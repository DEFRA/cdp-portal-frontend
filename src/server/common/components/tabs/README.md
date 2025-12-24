# Tabs

## Accessibility

- Tab list has `role="tablist"` with `aria-label`
- Each tab has `role="tab"` with:
  - `aria-controls` pointing to panel
  - `aria-selected` state
- Panel has `role="tabpanel"` with `aria-labelledby`

## JavaScript

Uses `data-js="app-tabs"` and `data-js="app-tab"` for JavaScript enhancement.

## Notes

- Tab IDs are generated from label using kebab-case
- Only the active tab's panel is rendered
- Content can be provided via caller block or `panel` property
