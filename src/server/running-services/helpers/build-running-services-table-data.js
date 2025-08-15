import upperFirst from 'lodash/upperFirst.js'

import { fetchRunningServicesFilters } from './fetch/fetch-running-services-filters.js'
import { buildSuggestions } from '../../common/components/autocomplete/helpers/build-suggestions.js'
import { getEnvironments } from '../../common/helpers/environments/get-environments.js'
import { transformRunningServices } from './transformers/running-services.js'
import { runningServiceToEntityRow } from './transformers/running-service-to-entity-row.js'
import { sortByOwner } from '../../common/helpers/sort/sort-by-owner.js'
import { fetchRunningServices } from './fetch/fetch-running-services.js'
import { fetchServices } from '../../common/helpers/fetch/fetch-entities.js'

function getFilters(runningServicesFilters) {
  const {
    filters: { services, users, statuses, teams }
  } = runningServicesFilters

  const serviceFilters = buildSuggestions(
    services.map((serviceName) => ({ text: serviceName, value: serviceName }))
  )

  const userFilters = buildSuggestions(
    users.map((user) => ({ text: user.displayName, value: user.id }))
  )

  const statusFilters = buildSuggestions(
    statuses.map((status) => ({ text: upperFirst(status), value: status }))
  )

  const teamFilters = buildSuggestions(
    teams.map((team) => ({ text: team.name, value: team.teamId }))
  )

  return {
    serviceFilters,
    userFilters,
    statusFilters,
    teamFilters
  }
}

async function buildRunningServicesTableData(request) {
  const query = request.query
  const userSession = await request.getUserSession()
  const environments = getEnvironments(userSession?.scope)
  const userScopeUUIDs = userSession?.uuidScope ?? []

  const [deployableServices, runningServicesFilters, runningServices] =
    await Promise.all([
      fetchServices(),
      fetchRunningServicesFilters(),
      fetchRunningServices(environments, {
        service: query.service,
        status: query.status,
        team: query.team,
        user: query.user
      })
    ])

  const { serviceFilters, userFilters, statusFilters, teamFilters } =
    getFilters(runningServicesFilters)

  const services = transformRunningServices({
    runningServices,
    deployableServices,
    userScopeUUIDs
  })

  const ownerSorter = sortByOwner('serviceName')
  const decorator = runningServiceToEntityRow(environments)
  const rows = services.toSorted(ownerSorter).map(decorator)

  return {
    environments,
    rows,
    serviceFilters,
    userFilters,
    statusFilters,
    teamFilters
  }
}

export { buildRunningServicesTableData }
