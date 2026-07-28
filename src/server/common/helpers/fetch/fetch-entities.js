import qs from 'qs'

import { config } from '#config/config.js'
import { fetchJson } from './fetch-json.js'
import { entityTypes } from '@defra/cdp-validation-kit'
import { entityStatuses } from '@defra/cdp-validation-kit/src/constants/entities.js'

const portalBackendUrl = config.get('portalBackendUrl')

export async function fetchEntity(entityName) {
  const endpoint = `${portalBackendUrl}/entities/${entityName}`

  const { payload } = await fetchJson(endpoint)
  return payload
}

export async function fetchEntities(queryParams = {}) {
  const endpoint = `${portalBackendUrl}/entities${qs.stringify(queryParams, {
    arrayFormat: 'repeat',
    addQueryPrefix: true
  })}`

  const { payload } = await fetchJson(endpoint)
  return payload ?? []
}

export function fetchTestSuites(queryParams) {
  return fetchEntities({
    type: entityTypes.testSuite,
    status: [entityStatuses.created, entityStatuses.creating],
    ...queryParams
  })
}

export function fetchServices(queryParams) {
  return fetchEntities({
    type: entityTypes.microservice,
    status: [entityStatuses.created, entityStatuses.creating],
    ...queryParams
  })
}

export async function fetchServiceNames(userSession) {
  const teamIds = userSession?.isAdmin
    ? []
    : userSession.scope
        .filter((s) => s.startsWith('team:'))
        .map((s) => s.replace('team:', ''))
  const services = await fetchServices({ teamIds })

  return services.map((service) => service.name)
}

export async function fetchDecommissions(queryParams) {
  const entities = await fetchEntities({
    status: [entityStatuses.decommissioned, entityStatuses.decommissioning],
    ...queryParams
  })

  return entities.toSorted((a, b) =>
    b.decommissioned.started.localeCompare(a.decommissioned.started)
  )
}
