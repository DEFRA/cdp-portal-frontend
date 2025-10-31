import { buildQueryParamDetail } from '../helpers/build-query-param-detail.js'

export const debugRoute = {
  options: {
    id: 'admin/debug'
  },
  handler: async (request, h) => {
    const routes = request.server.table()

    const debugRoutes = routes
      .filter(
        (route) =>
          route.path.startsWith('/admin/debug/') &&
          route.path !== '/admin/debug/{endpointPath}'
      )
      .map((route) => {
        const { validate } = route.settings || {}
        const queryValidation = validate?.query

        let queryParamDetail
        if (queryValidation?.describe) {
          queryParamDetail = buildQueryParamDetail(queryValidation.describe())
        }

        return {
          method: route.method.toUpperCase(),
          path: route.path,
          queryParamDetail
        }
      })

    return h.view('admin/debug/views/debug.njk', {
      pageTitle: 'Debug Routes',
      debugRoutes
    })
  }
}
