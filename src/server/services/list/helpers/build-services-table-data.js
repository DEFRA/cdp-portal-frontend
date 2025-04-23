import { sortBy } from '~/src/server/common/helpers/sort/sort-by.js'
import { sortByName } from '~/src/server/common/helpers/sort/sort-by-name.js'
import { entityToEntityRow } from '~/src/server/services/list/transformers/entity-to-entity-row.js'
import { buildSuggestions } from '~/src/server/common/components/autocomplete/helpers/build-suggestions.js'
import { sortByOwner } from '~/src/server/common/helpers/sort/sort-by-owner.js'
import { fetchServices } from '~/src/server/common/helpers/fetch/fetch-entities.js'
import { fetchFilters } from '~/src/server/common/helpers/fetch/fetch-filters.js'
import { entityOwnerDecorator } from '~/src/server/test-suites/helpers/decorators/entity-owner-decorator.js'

async function buildServicesTableData({
  service,
  teamId,
  isAuthenticated,
  userScopeUUIDs
}) {
  const [filters, microservices] = await Promise.all([
    fetchFilters({ type: 'Microservice' }),
    fetchServices({ name: service, teamId })
  ])

  const entityFilters = filters.entities

  const serviceFilters = buildSuggestions(
    entityFilters.toSorted(sortByName).map((serviceName) => ({
      text: serviceName,
      value: serviceName
    }))
  )
  const teamFilters = buildSuggestions(
    filters.teams
      .sort(sortBy('name', 'asc'))
      .map(({ name, teamId: value }) => ({
        text: name,
        value
      }))
  )

  const rowDecorator = entityToEntityRow(isAuthenticated)
  const ownerSorter = sortByOwner('name')
  const rows = microservices
    .map(entityOwnerDecorator(userScopeUUIDs))
    .toSorted(ownerSorter)
    .map(rowDecorator)

  return {
    rows,
    servicesCount: entityFilters.length,
    filters: {
      service: serviceFilters,
      team: teamFilters
    }
  }
}

export { buildServicesTableData }
