import union from 'lodash/union.js'
import unionBy from 'lodash/unionBy.js'

import { sortBy } from '~/src/server/common/helpers/sort/sort-by.js'
import { sortByName } from '~/src/server/common/helpers/sort/sort-by-name.js'
import { fetchRepositories } from '~/src/server/common/helpers/fetch/fetch-repositories.js'
import { repositoriesDecorator } from '~/src/server/common/helpers/decorators/repositories.js'
import { serviceToEntityRow } from '~/src/server/services/list/transformers/service-to-entity-row.js'
import { fetchDeployableServices } from '~/src/server/common/helpers/fetch/fetch-deployable-services.js'
import { buildSuggestions } from '~/src/server/common/components/autocomplete/helpers/build-suggestions.js'
import { fetchInProgressFilters } from '~/src/server/services/list/helpers/fetch/fetch-in-progress-filters.js'
import { fetchInProgressStatus } from '~/src/server/services/helpers/fetch/fetch-in-progress-status.js'
import { createServiceStatusToService } from '~/src/server/common/transformers/create-service-status-to-service.js'
import { fetchDeployableServicesFilters } from '~/src/server/services/list/helpers/fetch/fetch-deployable-services-filters.js'
import { sortByOwner } from '~/src/server/common/helpers/sort/sort-by-owner.js'

async function buildServicesTableData({
  service,
  teamId,
  isAuthenticated,
  userScopeUUIDs
}) {
  const kind = 'microservice'

  const [
    deployableFilters,
    inProgressFilters,
    deployableServices,
    inProgressStatuses,
    repositoriesResponse
  ] = await Promise.all([
    fetchDeployableServicesFilters(),
    fetchInProgressFilters({ kind }),
    fetchDeployableServices({ service, teamId }),
    fetchInProgressStatus({ service, teamId, kind }),
    fetchRepositories()
  ])

  const inProgressServices = inProgressStatuses?.map(
    createServiceStatusToService
  )

  const { repositories } = repositoriesResponse
  const decorator = repositoriesDecorator(repositories)

  const deployableServicesWithRepository = deployableServices.map(decorator)
  const inProgressServicesWithRepository = inProgressServices.map(decorator)

  // Services from Self Service Ops /status/in-progress overwrite services from Portal Backends /services
  const services = unionBy(
    inProgressServicesWithRepository,
    deployableServicesWithRepository,
    'serviceName'
  )
  const allFilters = union(
    inProgressFilters.services,
    deployableFilters.filters.services
  )
  const serviceFilters = buildSuggestions(
    allFilters.toSorted(sortByName).map((serviceName) => ({
      text: serviceName,
      value: serviceName
    }))
  )
  const teamFilters = buildSuggestions(
    unionBy(inProgressFilters.teams, deployableFilters.filters.teams, 'teamId')
      .sort(sortBy('name', 'asc'))
      .map(({ name, teamId: value }) => ({
        text: name,
        value
      }))
  )

  const rowDecorator = serviceToEntityRow(isAuthenticated)
  const ownerSorter = sortByOwner('serviceName')
  const rows = services
    .map((serviceDetail) => ({
      ...serviceDetail,
      isOwner: serviceDetail.teams.some((team) =>
        userScopeUUIDs.includes(team.teamId)
      )
    }))
    .toSorted(ownerSorter)
    .map(rowDecorator)

  return {
    rows,
    servicesCount: allFilters.length,
    filters: {
      service: serviceFilters,
      team: teamFilters
    }
  }
}

export { buildServicesTableData }
