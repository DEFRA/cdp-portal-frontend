import Joi from 'joi'
import Boom from '@hapi/boom'
import { entityTypes } from '@defra/cdp-validation-kit'
import { entityStatuses } from '@defra/cdp-validation-kit/src/constants/entities.js' // TODO: why is this not exposed?

import { fetchTestSuites } from '#server/common/helpers/fetch/fetch-entities.js'
import { fetchFilters } from '#server/common/helpers/fetch/fetch-filters.js'
import { sortByOwner } from '#server/common/helpers/sort/sort-by-owner.js'
import { buildSuggestions } from '#server/common/components/autocomplete/helpers/build-suggestions.js'
import { sortByName } from '#server/common/helpers/sort/sort-by-name.js'
import { sortBy } from '#server/common/helpers/sort/sort-by.js'

import { entityOwnerDecorator } from '../helpers/decorators/entity-owner-decorator.js'

const testSuiteListController = {
  options: {
    id: 'test-suites',
    validate: {
      query: Joi.object({
        testSuite: Joi.string().allow(''),
        teamId: Joi.string().allow(''),
        page: Joi.number(),
        size: Joi.number()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const userSession = request.auth.credentials
    const userScope = userSession?.scope ?? []
    const service = request.query.service
    const teamId = request.query.teamId

    const [testSuites, backendFilters] = await Promise.all([
      fetchTestSuites({
        // TODO
        service,
        teamId
      }),
      fetchFilters({
        type: entityTypes.testSuite,
        status: [entityStatuses.created, entityStatuses.creating]
      })
    ])

    const ownerDecorator = entityOwnerDecorator(userScope)
    const ownerSorter = sortByOwner('name')

    const rows = testSuites?.map(ownerDecorator).toSorted(ownerSorter)

    const filters = {
      testSuite: buildSuggestions(
        backendFilters.entities.toSorted(sortByName).map((testSuiteName) => ({
          text: testSuiteName,
          value: testSuiteName
        }))
      ),
      team: buildSuggestions(
        backendFilters.teams
          .toSorted(sortBy('name', 'asc'))
          .map(({ name, teamId: value }) => ({
            text: name,
            value
          }))
      )
    }

    return h.view('test-suites/views/list', {
      pageTitle: 'Test Suites',
      tableData: {
        headers: [
          { id: 'owner', classes: 'app-entity-table__cell--owned' },
          {
            id: 'test-suite',
            text: 'Test Suite',
            width: '35',
            isLeftAligned: true
          },
          { id: 'team', text: 'Team', width: '25' },
          { id: 'kind', text: 'Kind', width: '15' },
          { id: 'created', text: 'Created', width: '25' }
        ],
        rows,
        noResult: 'No test suites found',
        isWide: true,
        isInverse: true
      },
      testSuiteFilters: filters.testSuite,
      teamFilters: filters.team,
      testSuitesInfo: [
        {
          heading: {
            text: 'Total'
          },
          entity: {
            kind: 'text',
            value: backendFilters.entities.length ?? 0
          }
        }
      ]
    })
  }
}

export { testSuiteListController }
