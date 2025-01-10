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
    inProgressStatusResponse,
    repositoriesResponse
  ] = await Promise.all([
    fetchDeployableServicesFilters(),
    fetchInProgressFilters({ kind }),
    fetchDeployableServices({ service, teamId }),
    fetchInProgressStatus({ service, teamId, kind }),
    fetchRepositories()
  ])

  const { inProgress } = inProgressStatusResponse
  const inProgressServices = inProgress?.map(createServiceStatusToService)

  const { repositories } = repositoriesResponse
  const decorator = repositoriesDecorator(repositories)
  const deployableServicesWithRepository =
    deployableServices?.map(decorator) ?? []
  const inProgressServicesWithRepository =
    inProgressServices?.map(decorator) ?? []

  // Services from Self Service Ops /status/in-progress overwrite services from Portal Backends /services
  const services = unionBy(
    inProgressServicesWithRepository,
    deployableServicesWithRepository,
    'serviceName'
  )
  const serviceFilters = buildSuggestions(
    union(
      inProgressFilters.filters.services,
      deployableFilters.filters.services
    )
      .sort(sortByName)
      .map((serviceName) => ({
        text: serviceName,
        value: serviceName
      }))
  )
  const teamFilters = buildSuggestions(
    unionBy(
      inProgressFilters.filters.teams,
      deployableFilters.filters.teams,
      'teamId'
    )
      .sort(sortBy('name', 'asc'))
      .map(({ name, teamId: value }) => ({
        text: name,
        value
      }))
  )

  const rowDecorator = serviceToEntityRow(isAuthenticated)
  const rows = services
    .map((serviceDetail) => ({
      ...serviceDetail,
      userOwnsService: serviceDetail.teams.some((team) =>
        userScopeUUIDs.includes(team.teamId)
      )
    }))
    .sort(sortByOwner)
    .map(rowDecorator)

  return {
    rows,
    filters: {
      service: serviceFilters,
      team: teamFilters
    }
  }
}

export { buildServicesTableData }
