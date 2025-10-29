import { routeLookup } from '../../common/helpers/route-lookup/index.js'

export const debugRedirectController = {
  handler: async (request, h) => {
    const endpointPath = request.params.endpointPath
    const payload = request.payload

    const pathParams = {}
    const queryParams = {}

    Object.entries(payload).forEach(([key, value]) => {
      if (key.startsWith('path-')) {
        pathParams[key.replace('path-', '')] = value
      } else if (key.startsWith('query-') && value !== '') {
        queryParams[key.replace('query-', '')] = value
          .split(',')
          .map((v) => v.trim())
      }
    })

    const route = routeLookup(
      request.server,
      endpointPath.startsWith('/') ? endpointPath.slice(1) : endpointPath,
      { params: pathParams, query: queryParams }
    )
    return h.redirect(route)
  }
}
