import qs from 'qs'

import { config } from '~/src/config/config.js'
import { fetchJson } from '~/src/server/common/helpers/fetch/fetch-json.js'

async function fetchEntityStatus(entityName) {
  const endpoint = `${config.get('portalBackendUrl')}/entities/${entityName}/status`

  const { payload } = await fetchJson(endpoint)
  return payload
}

async function fetchEntity(entityName) {
  const endpoint = `${config.get('portalBackendUrl')}/entities/${entityName}`

  const { payload } = await fetchJson(endpoint)
  return payload
}

async function fetchEntities(queryParams = {}) {
  const endpoint =
    config.get('portalBackendUrl') +
    '/entities' +
    qs.stringify(queryParams, { arrayFormat: 'repeat', addQueryPrefix: true })

  const { payload } = await fetchJson(endpoint)
  return payload ?? []
}

async function fetchTestSuites(queryParams) {
  return fetchEntities({ type: 'TestSuite', ...queryParams })
}

async function fetchServices(queryParams) {
  return fetchEntities({ type: 'Microservice', ...queryParams })
}

export {
  fetchServices,
  fetchTestSuites,
  fetchEntities,
  fetchEntity,
  fetchEntityStatus
}
