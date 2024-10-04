/**
 * Overrides the renderer from the `marked-alerts` extension to render a GDS style alert box.
 */
export function gdsTableRenderer() {
  return {
    extensions: [
      {
        name: 'table',
        level: 'block',
        renderer(token) {
          const header = tableRow({
            text: token.header.map((t) => tableCell(t, this.parser)).join('')
          })

          const body = token.rows
            .map((row) => {
              const cells = row.map((c) => tableCell(c, this.parser)).join('')
              return tableRow({ text: cells })
            })
            .join('')

          return (
            '<table class="govuk-table">\n' +
            '<thead class="govuk-table__head">\n' +
            header +
            '</thead>\n' +
            `<tbody class="govuk-table__body">${body}</tbody>\n` +
            '</table>\n'
          )
        }
      }
    ]
  }
}

function tableRow({ text }) {
  return `<tr class="govuk-table__row">\n${text}</tr>\n`
}

function tableCell(token, parser) {
  const content = parser.parseInline(token.tokens)
  const align = token.align ? ` align="${token.align}"` : ''
  if (token.header) {
    return `<th class="govuk-table__header"${align}>${content}</th>`
  }
  return `<td class="govuk-table__cell"${align}>${content}</th>`
}
