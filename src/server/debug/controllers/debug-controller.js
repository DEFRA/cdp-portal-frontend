export const debugController = {
  options: {
    id: 'debug'
  },
  handler: async (request, h) => {
    const routes = request.server.table()

    const debugRoutes = routes
      .filter(
        (r) =>
          r.path.startsWith('/debug/') && r.path !== '/debug/{endpointPath}'
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

    return h.view('debug/views/debug.njk', {
      debugRoutes
    })
  }
}
