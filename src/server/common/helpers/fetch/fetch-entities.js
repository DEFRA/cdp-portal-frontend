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
  return fetchEntities({ type: 'TestSuite', ...queryParams })
}

function fetchServices(queryParams) {
  return fetchEntities({ type: 'Microservice', ...queryParams })
}

async function fetchDecommissions(queryParams) {
  const decommissionedStatuses = ['Decommissioned', 'Decommissioning']
  const entities = await fetchEntities({
    includeDecommissioned: true,
    ...queryParams
  })

  return entities
    .filter((entity) => decommissionedStatuses.includes(entity.status))
    .toSorted((a, b) =>
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
