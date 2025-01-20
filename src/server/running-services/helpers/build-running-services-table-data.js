import upperFirst from 'lodash/upperFirst.js'
import { validate as uuidValidate } from 'uuid'

import { fetchRunningServicesFilters } from '~/src/server/running-services/helpers/fetch/fetch-running-services-filters.js'
import { buildSuggestions } from '~/src/server/common/components/autocomplete/helpers/build-suggestions.js'
import { fetchDeployableServices } from '~/src/server/common/helpers/fetch/fetch-deployable-services.js'
import { getEnvironments } from '~/src/server/common/helpers/environments/get-environments.js'
import { transformRunningServices } from '~/src/server/running-services/helpers/transformers/running-services.js'
import { runningServiceToEntityRow } from '~/src/server/running-services/helpers/transformers/running-service-to-entity-row.js'
import { sortByOwner } from '~/src/server/common/helpers/sort/sort-by-owner.js'
import { fetchRunningServices } from '~/src/server/running-services/helpers/fetch/fetch-running-services.js'

function getFilters(runningServicesFilters) {
  const { filters } = runningServicesFilters

  const serviceFilters = buildSuggestions(
    filters.services.map((serviceName) => ({
      text: serviceName,
      value: serviceName
    }))
  )

  const userFilters = buildSuggestions(
    filters.users.map((user) => ({
      text: user.displayName,
      value: user.id
    }))
  )

  const order = ['running', 'pending', 'undeployed']
  const statusFilters = buildSuggestions(
    filters.statuses
      .sort((a, b) => order.indexOf(a) - order.indexOf(b))
      .map((status) => ({
        text: upperFirst(status),
        value: status
      }))
  )

  const teamFilters = buildSuggestions(
    filters.teams.map((team) => ({
      text: team.name,
      value: team.teamId
    }))
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
  const isAuthenticated = authedUser?.isAuthenticated
  const environments = getEnvironments(authedUser?.scope)
  const userScopeUUIDs = authedUser?.scope.filter(uuidValidate) ?? []

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
  const decorator = runningServiceToEntityRow(environments, isAuthenticated)
  const rows = services.toSorted(ownerSorter).map(decorator)

  return {
    environments,
    isAuthenticated,
    rows,
    serviceFilters,
    userFilters,
    statusFilters,
    teamFilters
  }
}

export { buildRunningServicesTableData }
