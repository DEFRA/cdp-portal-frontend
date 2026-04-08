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

  if (query.tag) {
    searchUrl.searchParams.set('tag', query.tag)
  }

  if (query.team) {
    searchUrl.searchParams.set('team', query.team)
  }

  if (query.versionStart) {
    searchUrl.searchParams.set('gteVersion', query.versionStart)
  }

  if (query.versionEnd) {
    searchUrl.searchParams.set('lteVersion', query.versionEnd)
  }

  if (query.entity) {
    searchUrl.searchParams.set('entity', query.entity)
  }

  if (query.page) {
    searchUrl.searchParams.set('page', query.page)
  }

  if (query.size) {
    searchUrl.searchParams.set('size', query.size)
  }

  const resp = await fetch(searchUrl, { method: 'GET' })
  if (resp.status === 200) {
    return {
      results: await resp.json(),
      meta: {
        total: Number(resp.headers.get('X-Total-Count')),
        totalPages: Number(resp.headers.get('X-Total-Pages'))
      }
    }
  }

  throw Error(`Unable to fetch dependents for ${searchUrl}`)
}

export async function getEntityDependencies(name, version, query = {}) {
  const baseUrl = config.get('sbomExplorerBackendUrl')
  const searchUrl = new URL(
    `/entities/${encodeURIComponent(name)}/dependencies`,
    baseUrl
  )

  searchUrl.searchParams.set('entityVersion', version)

  if (query.dependencyVersion) {
    searchUrl.searchParams.set('version', query.dependencyVersion)
  }

  if (query.dependencyType) {
    searchUrl.searchParams.set('type', query.dependencyType)
  }

  if (query.dependencyName) {
    searchUrl.searchParams.set('name', query.dependencyName.split(':')?.at(1))
  }

  if (query.entityStage) {
    searchUrl.searchParams.set('stage', query.entityStage)
  }

  const resp = await fetch(searchUrl, { method: 'GET' })
  if (resp.status === 200) {
    return {
      results: await resp.json(),
      meta: {
        total: Number(resp.headers.get('X-Total-Count')),
        totalPages: Number(resp.headers.get('X-Total-Pages'))
      }
    }
  }

  throw Error(`Unable to fetch dependencies for ${searchUrl}`)
}
