import { searchDependencies } from '../../FilterService.js'

export async function GET(request) {
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
