import { sortBy } from '../../../common/helpers/sort/sort-by.js'
import { sortByName } from '../../../common/helpers/sort/sort-by-name.js'
import { entityToEntityRow } from '../transformers/entity-to-entity-row.js'
import { buildSuggestions } from '../../../common/components/autocomplete/helpers/build-suggestions.js'
import { sortByOwner } from '../../../common/helpers/sort/sort-by-owner.js'
import { fetchServices } from '../../../common/helpers/fetch/fetch-entities.js'
import { fetchFilters } from '../../../common/helpers/fetch/fetch-filters.js'
import { entityOwnerDecorator } from '../../../test-suites/helpers/decorators/entity-owner-decorator.js'
import { entityTypes } from '@defra/cdp-validation-kit'
import { serviceTags } from '../../../admin/tags/helpers/service-tags.js'
import { statusTagClassMap } from '../../../common/helpers/status-tag-class-map.js'
import { relativeDate } from '../../../common/helpers/date/relative-date.js'

async function buildServicesTableData({ service, teamId, userScopes }) {
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

  const ownerSorter = sortByOwner('name')
  const rows = microservices
    .map(entityOwnerDecorator(userScopes))
    .toSorted(ownerSorter)
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

async function buildServicesTableDataV2({ service, teamId, userScopes }) {
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

  const ownerSorter = sortByOwner('name')
  const rows = microservices
    .map((s) => ({
      isOwner: s.teams.find((team) =>
        userScopes.includes(`team:${team.teamId}`)
      )
        ? star
        : '',
      name: s.name,
      teams: s.teams,
      status:
        s.status === 'Created'
          ? relativeDate(s.created)
          : `<strong class="govuk-tag app-tag ${statusTagClassMap(s.status)}" data-testid="govuk-tag">${s.status}</strong>`,
      type: s.subType,
      tags: buildTags(s.tags)
    }))
    .toSorted(ownerSorter)

  return {
    rows,
    servicesCount: entityFilters.length,
    filters: {
      service: serviceFilters,
      team: teamFilters
    }
  }
}

function buildTags(tags) {
  if (tags.length === 0) return ''

  const renderedTags = tags
    .map((tagName) => {
      const tagDetail = serviceTags[tagName] ?? {
        className: '',
        displayName: tagName
      }
      return `<strong class="govuk-tag app-tag ${tagDetail.className}" data-testid="govuk-tag">${tagDetail.displayName}</strong>`
    })
    .join('\n')

  return `<div className="app-!-layout-centered govuk-!-margin-top-2"><div className="app-entity-table__row-caption">${renderedTags}</div></div>`
}

const star = `
<span class="app-tool-tip app-tool-tip--small" data-text="Owned Service">
   <svg class="app-icon app-star-icon app-icon--minuscule" width="48" height="48" viewBox="0 -960 960 960" role="img" data-testid="app-star-icon" aria-label="Owned service">
  <path stroke="#e6c000" stroke-width="80" d="M480-243 292-129q-15 9-28.5 8T240-131q-11-7-15.5-18.5T222-178l51-214-167-147q-10-8-14.5-21t-.5-27q4-13 14-21.5t27-9.5l221-19 84-204q6-13 18-20.5t25-7.5q13 0 25 7.5t18 20.5l85 204 221 19q16 1 26 9.5t14 21.5q4 14-.5 27T854-539L687-392l51 214q2 17-2.5 28.5T720-131q-10 9-23.5 10t-27.5-8L480-243Z"></path>
</svg>

</span>`

export { buildServicesTableData, buildServicesTableDataV2 }
