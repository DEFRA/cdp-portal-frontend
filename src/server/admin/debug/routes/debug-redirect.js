import { routeLookup } from '../../../common/helpers/route-lookup/index.js'

export const debugRedirectRoute = {
  handler: async (request, h) => {
    const endpointPath = request.params.endpointPath
    const payload = request.payload

    const pathParams = {}
    const queryParams = {}

    for (const [key, value] of Object.entries(payload)) {
      if (key.startsWith('path-')) {
        pathParams[key.replace('path-', '')] = value
      }
      if (key.startsWith('query-') && value !== '') {
        queryParams[key.replace('query-', '')] = value
          .split(',')
          .map((valuePart) => valuePart.trim())
      }
    }

    const route = routeLookup(
      request.server,
      endpointPath.startsWith('/') ? endpointPath.slice(1) : endpointPath,
      { params: pathParams, query: queryParams }
    )
    return h.redirect(route)
  }
}
