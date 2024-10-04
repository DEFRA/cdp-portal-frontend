import { marked } from 'marked'
import { gdsTableRenderer } from '~/src/server/common/helpers/markdown/gds-table-renderer'

describe('#gdsTableRenderer', () => {
  const markdownRenderer = marked.use(gdsTableRenderer())

  test('renders with GDS classes', () => {
    const md = `
| key | value |
|-----|-------|
| 1   | 2     |
`
    const html = markdownRenderer.parse(md)

    expect(html).toBe(`<table class="govuk-table">
<thead class="govuk-table__head">
<tr class="govuk-table__row">
<th class="govuk-table__header">key</th><th class="govuk-table__header">value</th></tr>
</thead>
<tbody class="govuk-table__body"><tr class="govuk-table__row">
<td class="govuk-table__cell">1</th><td class="govuk-table__cell">2</th></tr>
</tbody>
</table>
`)
  })
})
