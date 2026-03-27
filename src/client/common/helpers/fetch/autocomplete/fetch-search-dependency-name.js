export default async function searchDependencyName(value) {
  const response = await fetch(
    `${location.origin}/dependency-explorer/api/deps-search?partialName=${value}`,
    {
      headers: { 'X-Requested-With': 'XMLHttpRequest' }
    }
  )
  const json = await response.json()

  if (response?.ok) {
    return json.suggestions
  }

  throw new Error(json.message)
}
