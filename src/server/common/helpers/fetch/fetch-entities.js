import qs from 'qs'

import { config } from '../../../../config/config.js'
import { fetchJson } from './fetch-json.js'
import { entityTypes } from '@defra/cdp-validation-kit'
import { entityStatuses } from '@defra/cdp-validation-kit/src/constants/entities.js'

const portalBackendUrl = config.get('portalBackendUrl')
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
  console.log(endpoint)
  const { payload } = await fetchJson(endpoint)
  return payload ?? []
}

function fetchTestSuites(queryParams) {
  console.log(queryParams)
  return fetchEntities({
    type: entityTypes.testSuite,
    status: [entityStatuses.created, entityStatuses.creating],
    ...queryParams
  })
}

function fetchServices(queryParams) {
  return fetchEntities({
    type: entityTypes.microservice,
    status: [entityStatuses.created, entityStatuses.creating],
    ...queryParams
  })
}

async function fetchServiceNames(userSession) {
  const teamIds = userSession?.isAdmin
    ? []
    : userSession.scope
        .filter((s) => s.startsWith('team:'))
        .map((s) => s.replace('team:', ''))
  const services = await fetchServices({ teamIds })

  return services.map((service) => service.name)
}

async function fetchDecommissions(queryParams) {
  const entities = await fetchEntities({
    status: [entityStatuses.decommissioned, entityStatuses.decommissioning],
    ...queryParams
  })

  return entities.toSorted((a, b) =>
    b.decommissioned.started.localeCompare(a.decommissioned.started)
  )
}

export {
  fetchServices,
  fetchServiceNames,
  fetchTestSuites,
  fetchEntities,
  fetchEntity,
  fetchDecommissions
}
