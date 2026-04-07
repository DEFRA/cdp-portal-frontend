import Boom from '@hapi/boom'
import { searchDependencies } from '../../FilterService.js'

export async function GET(request) {
  if (!request.isXhr()) {
    return Boom.methodNotAllowed('This route is only available via XHR')
  }

  const query = request.query

  // Handle autocomplete type:name split
  if (query.partialName.includes(':')) {
    query.partialName = query.partialName.split(':').at(1)
  }

  const results = await searchDependencies(query)

  return {
    suggestions: results.map(({ name, type }) => ({
      value: `${type}:${name}`,
      text: name
    }))
  }
}
