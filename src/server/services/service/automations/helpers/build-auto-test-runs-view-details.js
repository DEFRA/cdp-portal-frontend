import { sortBy } from '../../../../common/helpers/sort/sort-by.js'
import { fetchTestSuites } from '../../../../common/helpers/fetch/fetch-entities.js'
import { testSuiteToEntityRow } from './transformers/test-suite-to-entity-row.js'
import { renderTestSuiteTagHtml } from './render-test-suite-tag-html.js'
import { buildSuggestions } from '../../../../common/components/autocomplete/helpers/build-suggestions.js'
import { fetchTeamTestRepositories, getAutoTestRunDetails } from './fetchers.js'
import { testKind } from '../../../../test-suites/constants/test-kind.js'

function sortRows(rowA, rowB) {
  const aHeader = rowA.cells.find(
    ({ headers }) => headers === 'test-suite'
  )?.headers
  const bHeader = rowB.cells.find(
    ({ headers }) => headers === 'test-suite'
  )?.headers

  return aHeader.localeCompare(bHeader)
}

function buildOptions(testSuites, testSuiteRepos = []) {
  const testSuitesWithRepoDetail = testSuites
    .map((testSuite) => ({
      ...testSuite,
      ...testSuiteRepos.find((repo) => repo?.id === testSuite?.name)
    }))
    .filter((testSuite) => testSuite?.subType === testKind.Journey)
    .map((testSuite) => ({
      text: testSuite.name,
      value: testSuite.name,
      hint: renderTestSuiteTagHtml(testSuite?.subType) ?? ''
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
  const promisesTestSuites = serviceTeamIds.map(fetchTestSuites)
  const promisesTestRepositories = serviceTeamIds.map(fetchTeamTestRepositories)

  const [
    autoTestRunDetails,
    testSuitesResponse = [],
    testSuiteReposResponse = []
  ] = await Promise.all([
    getAutoTestRunDetails(serviceId),
    Promise.all(promisesTestSuites),
    Promise.all(promisesTestRepositories)
  ])

  const testSuites = testSuitesResponse.flat()
  const testSuiteRepos = testSuiteReposResponse.flat()

  const rowBuilder = testSuiteToEntityRow({
    serviceName: serviceId,
    environments,
    testSuiteRepos
  })
  const rows = autoTestRunDetails?.testSuites
    ? Object.entries(autoTestRunDetails.testSuites)
        .map(rowBuilder)
        .toSorted(sortRows)
    : []

  const testSuiteOptions = buildOptions(testSuites, testSuiteRepos)

  return { testSuiteOptions, rows }
}

export { buildAutoTestRunsViewDetails }
