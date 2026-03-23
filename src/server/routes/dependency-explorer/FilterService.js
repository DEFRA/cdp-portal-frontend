import { config } from '#config/config.js'

export async function searchDependencies(query) {
  const baseUrl = config.get('sbomExplorerBackendUrl')
  const searchUrl = new URL('/filters/dependencies', baseUrl)

  if (query.type) {
    searchUrl.searchParams.set('type', query.type)
  }

  if (query.partialName) {
    searchUrl.searchParams.set('partialName', query.partialName + '%')
  }

  if (query.environment) {
    searchUrl.searchParams.set('environment', query.environment)
  }

  const resp = await fetch(searchUrl, { method: 'GET' })
  if (resp.status === 200) {
    return resp.json()
  }

  return []
}
