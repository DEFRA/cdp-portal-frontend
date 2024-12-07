/**
 * @satisfies {Partial<import('@hapi/hapi').ServerRoute>}
 */
const accessibilityStatement = {
  handler: (_request, h) => {
    const title = 'Accessibility statement'

    return h.view('help/views/accessibility-statement', {
      pageTitle: title,
      heading: title
    })
  }
}

export { accessibilityStatement }
