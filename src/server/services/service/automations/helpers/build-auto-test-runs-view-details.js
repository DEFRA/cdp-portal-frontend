import { sortBy } from '~/src/server/common/helpers/sort/sort-by.js'
import { fetchTestSuites } from '~/src/server/common/helpers/fetch/fetch-test-suites.js'
import { testSuiteToEntityRow } from '~/src/server/services/service/automations/helpers/transformers/test-suite-to-entity-row.js'
import { renderTestSuiteTagHtml } from '~/src/server/services/service/automations/helpers/render-test-suite-tag-html.js'
import { buildSuggestions } from '~/src/server/common/components/autocomplete/helpers/build-suggestions.js'
import {
  fetchTeamTestRepositories,
  getAutoTestRunDetails
} from '~/src/server/services/service/automations/helpers/fetchers.js'

function sortRows(rowA, rowB) {
  const aHeader = rowA.cells.find(
    ({ headers }) => headers === 'test-suite'
  )?.headers
  const bHeader = rowB.cells.find(
    ({ headers }) => headers === 'test-suite'
  )?.headers

  return aHeader.localeCompare(bHeader)
}

function buildOptions(testSuites, testSuiteRepos) {
  const testSuitesWithRepoDetail = testSuites
    .map(({ testSuite }) => ({
      ...testSuite,
      ...testSuiteRepos.find((repo) => repo.id === testSuite.serviceName)
    }))
    .map((testSuite) => ({
      text: testSuite.serviceName,
      value: testSuite.serviceName,
      hint: renderTestSuiteTagHtml(testSuite?.topics) ?? ''
    }))
    .toSorted(sortBy('text', 'asc'))

  return testSuitesWithRepoDetail?.length
    ? buildSuggestions(testSuitesWithRepoDetail)
    : []
}

async function buildAutoTestRunsViewDetails({
  servicesTeamId,
  serviceId,
  environments
}) {
  const [autoTestRunDetails, testSuites = [], teamTestRepositories = []] =
    await Promise.all([
      getAutoTestRunDetails(serviceId),
      fetchTestSuites(servicesTeamId),
      fetchTeamTestRepositories(servicesTeamId)
    ])
  const testSuiteRepos = teamTestRepositories?.repositories ?? []

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
