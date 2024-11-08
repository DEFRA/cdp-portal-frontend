/**
 * @satisfies {Partial<ServerRoute>}
 */
const accessibilityStatement = {
  handler: (request, h) => {
    const title = 'Accessibility statement'

    return h.view('help/views/accessibility-statement', {
      pageTitle: title,
      heading: title
    })
  }
}

export { accessibilityStatement }
/**
 * @import { ServerRoute } from '@hapi/hapi'
 */
