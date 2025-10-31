export const debugRoute = {
  options: {
    id: 'admin/debug'
  },
  handler: async (request, h) => {
    const routes = request.server.table()

    const debugRoutes = routes
      .filter(
        (r) =>
          r.path.startsWith('/admin/debug/') &&
          r.path !== '/admin/debug/{endpointPath}'
      )
      .map((r) => {
        const { validate } = r.settings || {}
        const queryValidation = validate?.query

        let queryParams = []
        if (queryValidation && queryValidation.describe) {
          const desc = queryValidation.describe()
          queryParams = Object.keys(desc.keys || {})
        }

        return {
          method: r.method.toUpperCase(),
          path: r.path,
          queryParams
        }
      })

    return h.view('admin/debug/views/debug.njk', {
      pageTitle: 'Debug Routes',
      debugRoutes
    })
  }
}
