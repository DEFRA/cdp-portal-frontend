import { searchDependencies } from '../../FilterService.js'

export async function GET(request) {
  const results = await searchDependencies(request.query)

  return {
    suggestions: results.map(({ name, type }) => ({
      value: `${type}:${name}`,
      text: name
    }))
  }
}
