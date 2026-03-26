import { config } from '#config/config.js'

export async function getDependencyDependents(type, name, query = {}) {
  const baseUrl = config.get('sbomExplorerBackendUrl')
  const searchUrl = new URL(
    `/dependencies/${encodeURIComponent(type)}/${encodeURIComponent(name)}/dependents`,
    baseUrl
  )

  if (query.environment) {
    searchUrl.searchParams.set('environment', query.environment)
  }

  const resp = await fetch(searchUrl, { method: 'GET' })
  if (resp.status === 200) {
    return resp.json()
  }

  throw Error(`Unable to fetch dependents for ${searchUrl}`)
}

export async function getEntityDependencies(name, query = {}) {
  const baseUrl = config.get('sbomExplorerBackendUrl')
  const searchUrl = new URL(
    `/entities/${encodeURIComponent(name)}/dependencies`,
    baseUrl
  )

  if (query.entityVersion) {
    searchUrl.searchParams.set('entityVersion', query.entityVersion)
  }

  if (query.version) {
    searchUrl.searchParams.set('version', query.version)
  }

  if (query.type) {
    searchUrl.searchParams.set('type', query.type)
  }

  const resp = await fetch(searchUrl, { method: 'GET' })
  if (resp.status === 200) {
    return resp.json()
  }

  throw Error(`Unable to fetch dependencies for ${searchUrl}`)
}
