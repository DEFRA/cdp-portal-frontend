import { sortBy } from '../../../../common/helpers/sort/sort-by.js'
import { fetchTestSuites } from '../../../../common/helpers/fetch/fetch-entities.js'
import { testSuiteToEntityRow } from './transformers/test-suite-to-entity-row.js'
import { renderTestSuiteTagHtml } from './render-test-suite-tag-html.js'
import { buildSuggestions } from '../../../../common/components/autocomplete/helpers/build-suggestions.js'
import { getAutoTestRunDetails } from './fetchers.js'
import { testKind } from '../../../../test-suites/constants/test-kind.js'
import uniqBy from 'lodash/uniqBy.js'

function sortRows(rowA, rowB) {
  const aHeader = rowA.cells.find(
    ({ headers }) => headers === 'test-suite'
  )?.headers
  const bHeader = rowB.cells.find(
    ({ headers }) => headers === 'test-suite'
  )?.headers

  return aHeader.localeCompare(bHeader)
}

function buildOptions(testSuites) {
  const testSuitesWithRepoDetail = testSuites
    .map((testSuite) => ({
      ...testSuite
    }))
    .filter((testSuite) => testSuite?.subType === testKind.Journey)
    .map((testSuite) => ({
      text: testSuite.name,
      value: testSuite.name,
      hint: renderTestSuiteTagHtml(testSuite)
    }))
    .toSorted(sortBy('text', 'asc'))

  return testSuitesWithRepoDetail?.length
    ? buildSuggestions(testSuitesWithRepoDetail)
    : []
}

async function buildAutoTestRunsViewDetails({
  serviceTeams,
  serviceId,
  environments
}) {
  const serviceTeamIds = serviceTeams.map((team) => team.teamId)
  const [autoTestRunDetails, testSuites] = await Promise.all([
    getAutoTestRunDetails(serviceId),
    fetchTestSuites({ teamIds: serviceTeamIds })
  ])

  const rowBuilder = testSuiteToEntityRow({
    serviceName: serviceId,
    environments,
    testSuites
  })

  const rows = autoTestRunDetails?.testSuites
    ? Object.entries(autoTestRunDetails.testSuites)
        .flatMap(([testSuiteName, configs]) =>
          configs.map((config) => ({
            testSuiteName,
            profile: config.profile,
            activeEnvironments: config.environments
          }))
        )
        .map(rowBuilder)
        .toSorted(sortRows)
    : []

  const testSuiteOptions = buildOptions(testSuites)

  return { testSuiteOptions, rows }
}

export { buildAutoTestRunsViewDetails }
