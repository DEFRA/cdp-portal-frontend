import { searchDependencies } from '../../FilterService.js'

export async function GET(request) {
  const results = await searchDependencies(request.query)

  return {
    suggestions: results.map(({ name }) => ({ text: name, value: name }))
  }
}
