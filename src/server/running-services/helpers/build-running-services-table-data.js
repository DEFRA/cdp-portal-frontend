import upperFirst from 'lodash/upperFirst.js'

import { fetchRunningServicesFilters } from './fetch/fetch-running-services-filters.js'
import { buildSuggestions } from '../../common/components/autocomplete/helpers/build-suggestions.js'
import { getEnvironments } from '../../common/helpers/environments/get-environments.js'
import { transformRunningServices } from './transformers/running-services.js'
import { runningServiceToEntityRow } from './transformers/running-service-to-entity-row.js'
import { sortByOwner } from '../../common/helpers/sort/sort-by-owner.js'
import { fetchRunningServices } from './fetch/fetch-running-services.js'
import { fetchServices } from '../../common/helpers/fetch/fetch-entities.js'
import { performance } from 'perf_hooks'

const perf = {}

function start(request, name) {
  request.logger?.info(`-------------- ${name} start`)
  perf[name] = {}
  perf[name].start = performance.now()
}

function end(request, name) {
  perf[name].end = performance.now()
  request.logger?.info(`${name} took ${perf[name].end - perf[name].start}ms`)
  request.logger?.info(`-------------- ${name} end`)
}

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
  start(request, 'two')

  const query = request.query
  const userSession = await request.getUserSession()
  const environments = getEnvironments(userSession?.scope)
  const userScopes = userSession?.scope ?? []

  end(request, 'two')

  start(request, 'three')
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

  end(request, 'three')

  start(request, 'four')

  const { serviceFilters, userFilters, statusFilters, teamFilters } =
    getFilters(runningServicesFilters)

  end(request, 'four')

  start(request, 'five')
  const services = transformRunningServices({
    runningServices,
    deployableServices,
    userScopes
  })
  end(request, 'five')

  start(request, 'six')

  const ownerSorter = sortByOwner('serviceName')

  end(request, 'six')

  start(request, 'seven')
  const decorator = runningServiceToEntityRow(environments, request)

  end(request, 'seven')

  start(request, 'eight')
  const rows = services.toSorted(ownerSorter).map(decorator)
  end(request, 'eight')

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
