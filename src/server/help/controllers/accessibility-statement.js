/**
 * @satisfies {Partial<import('@hapi/hapi').ServerRoute>}
 */
const accessibilityStatement = {
  handler: (_request, h) => {
    return h.view('help/views/accessibility-statement', {
      pageTitle: 'Accessibility statement - Help'
    })
  }
}

export { accessibilityStatement }
