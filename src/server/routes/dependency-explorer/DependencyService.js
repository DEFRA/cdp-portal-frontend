import { config } from '#config/config.js'

export async function getDependencyDependents(type, name, query = {}) {
  const baseUrl = config.get('sbomExplorerBackendUrl')
  const searchUrl = new URL(`/dependencies/${type}/${name}/dependents`, baseUrl)

  if (query.environment) {
    searchUrl.searchParams.set('environment', query.environment)
  }

  const resp = await fetch(searchUrl, { method: 'GET' })
  if (resp.status === 200) {
    return resp.json()
  }

  throw Error(`Unable to fetch dependents for ${searchUrl}`)
}
