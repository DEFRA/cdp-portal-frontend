import { searchDependencies } from '../../FilterService.js'

export async function GET(request, h) {
  const { dependencyName, dependencyName_text: dependencyNameText } =
    request.query

  const results =
    dependencyNameText?.length >= 2
      ? await searchDependencies({
          partialName: dependencyNameText
        })
      : []

  return h.view('routes/dependency-explorer/api/deps-search/page.njk', {
    suggestions: results.map(({ name, type }) => ({
      value: `${type}:${name}`,
      text: name
    })),
    suggestionText: dependencyNameText,
    value: dependencyName
  })
}
