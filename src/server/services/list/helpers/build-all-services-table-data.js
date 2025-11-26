import { entityTypes } from '@defra/cdp-validation-kit'

import { sortBy } from '../../../common/helpers/sort/sort-by.js'
import { sortByName } from '../../../common/helpers/sort/sort-by-name.js'
import { entityToEntityRow } from '../transformers/entity-to-entity-row.js'
import { buildSuggestions } from '../../../common/components/autocomplete/helpers/build-suggestions.js'
import { fetchServices } from '../../../common/helpers/fetch/fetch-entities.js'
import { fetchFilters } from '../../../common/helpers/fetch/fetch-filters.js'
import { entityOwnerDecorator } from '../../../test-suites/helpers/decorators/entity-owner-decorator.js'

async function buildAllServicesTableData({ service, teamId, userScopes }) {
  const [filters, microservices] = await Promise.all([
    fetchFilters({
      type: entityTypes.microservice,
      status: ['Created', 'Creating']
    }),
    fetchServices({ name: service, teamIds: [teamId] })
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

  const rows = microservices
    .map(entityOwnerDecorator(userScopes))
    .map(entityToEntityRow)

  return {
    rows,
    servicesCount: entityFilters.length,
    filters: {
      service: serviceFilters,
      team: teamFilters
    }
  }
}

export { buildAllServicesTableData }
