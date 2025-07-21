import qs from 'qs'

import { config } from '~/src/config/config.js'
import { fetchJson } from '~/src/server/common/helpers/fetch/fetch-json.js'

const portalBackendUrl = config.get('portalBackendUrl')

async function fetchEntityStatus(entityName) {
  const endpoint = `${portalBackendUrl}/entities/${entityName}/status`

  const { payload } = await fetchJson(endpoint)
  return payload
}

async function fetchEntity(entityName) {
  const endpoint = `${portalBackendUrl}/entities/${entityName}`

  const { payload } = await fetchJson(endpoint)
  return payload
}

async function fetchEntities(queryParams = {}) {
  const endpoint = `${portalBackendUrl}/entities${qs.stringify(queryParams, {
    arrayFormat: 'repeat',
    addQueryPrefix: true
  })}`

  const { payload } = await fetchJson(endpoint)
  return payload ?? []
}

function fetchTestSuites(queryParams) {
  return fetchEntities({
    type: 'TestSuite',
    status: ['Created', 'Creating'],
    ...queryParams
  })
}

function fetchServices(queryParams) {
  return fetchEntities({
    type: ['Microservice', 'Prototype'],
    status: ['Created', 'Creating'],
    ...queryParams
  })
}

async function fetchDecommissions(queryParams) {
  const entities = await fetchEntities({
    status: ['Decommissioned', 'Decommissioning'],
    ...queryParams
  })

  return entities.toSorted((a, b) =>
    b.decommissioned.started.localeCompare(a.decommissioned.started)
  )
}

export {
  fetchServices,
  fetchTestSuites,
  fetchEntities,
  fetchEntity,
  fetchEntityStatus,
  fetchDecommissions
}
