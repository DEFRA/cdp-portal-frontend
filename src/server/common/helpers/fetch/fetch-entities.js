import qs from 'qs'

import { config } from '~/src/config/config.js'
import { fetchJson } from '~/src/server/common/helpers/fetch/fetch-json.js'

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

async function fetchTestSuites(teamId) {
  return fetchEntities({ type: 'TestSuite', teamId })
}

async function fetchServices(queryParams) {
  return fetchEntities({ type: 'Microservice', ...queryParams })
}

export { fetchServices, fetchTestSuites, fetchEntities, fetchEntity }
