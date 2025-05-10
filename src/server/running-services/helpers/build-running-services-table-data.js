import upperFirst from 'lodash/upperFirst.js'

import { fetchRunningServicesFilters } from '~/src/server/running-services/helpers/fetch/fetch-running-services-filters.js'
import { buildSuggestions } from '~/src/server/common/components/autocomplete/helpers/build-suggestions.js'
import { fetchDeployableServices } from '~/src/server/common/helpers/fetch/fetch-deployable-services.js'
import { getEnvironments } from '~/src/server/common/helpers/environments/get-environments.js'
import { transformRunningServices } from '~/src/server/running-services/helpers/transformers/running-services.js'
import { runningServiceToEntityRow } from '~/src/server/running-services/helpers/transformers/running-service-to-entity-row.js'
import { sortByOwner } from '~/src/server/common/helpers/sort/sort-by-owner.js'
import { fetchRunningServices } from '~/src/server/running-services/helpers/fetch/fetch-running-services.js'

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

async function buildRunningServicesTableData({ pre, query }) {
  const authedUser = pre.authedUser
  const environments = getEnvironments(authedUser?.scope)
  const userScopeUUIDs = authedUser?.uuidScope ?? []

  const [deployableServices, runningServicesFilters, runningServices] =
    await Promise.all([
      fetchDeployableServices(),
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
