import { config } from '#config/config.js'
import { formatText } from '#config/nunjucks/filters/filters.js'
import { getEnvironments } from '#server/common/helpers/environments/get-environments.js'
import { excludedEnvironments } from '#server/services/service/automations/helpers/constants/excluded-environments.js'
import { fetchTestSuites } from '#server/common/helpers/fetch/fetch-entities.js'
import { testSuiteToEntityRow } from '#server/services/service/automations/helpers/transformers/test-suite-to-entity-row.js'
import { fetchJson } from '#server/common/helpers/fetch/fetch-json.js'
import { renderTestSuiteTagHtml } from '#server/services/service/automations/helpers/render-test-suite-tag-html.js'
import { buildSuggestions } from '#server/common/components/autocomplete/helpers/build-suggestions.js'
import { buildOptions } from '#server/common/helpers/options/build-options.js'
import { sortBy } from '#server/common/helpers/sort/sort-by.js'
import { testKind } from '#server/test-suites/constants/test-kind.js'

const portalBackendUrl = config.get('portalBackendUrl')

export default {
  options: {
    id: `test-suites/{serviceId}/automations`
  },
  handler: async (request, h) => {
    const entity = request.app.entity
    const testSuiteName = entity.name
    const userSession = request.auth.credentials
    const serviceId = request.params.serviceId
    const serviceTeams = entity?.teams

    const environments = getEnvironments(
      userSession?.scope,
      entity?.subType
    ).filter((env) => !excludedEnvironments.includes(env.toLowerCase()))

    const environmentOptions = buildOptions(
      environments.map((env) => ({ text: formatText(env), value: env })),
      false
    )

    const { testSuiteOptions, rows } = await buildScheduledTestRunsViewDetails({
      serviceTeams,
      serviceId,
      environments
    })

    const supportVerticalHeadings = environments.length >= 5

    return h.view('test-suites/test-suite/automations/views/automations', {
      pageTitle: `Test Suite - ${testSuiteName} - Automations`,
      entity,
      environmentOptions,
      testSuiteOptions,
      tableData: {
        headers: [
          { id: 'test-suite', text: 'Test suite', width: '17' },
          { id: 'kind', text: 'Kind', width: '8' },
          { id: 'profile', text: 'Profile', width: '8' },
          ...environments.map((env) => ({
            ...(supportVerticalHeadings && { verticalText: true }),
            id: env.toLowerCase(),
            text: formatText(env),
            width: env.length
          })),
          { id: 'actions', text: 'Actions', isRightAligned: true, width: '12' }
        ],
        rows,
        noResult: 'Currently you have no tests set up to run on a schedule'
      },
      breadcrumbs: [
        {
          text: 'Test suites',
          href: '/test-suites'
        },
        {
          text: testSuiteName,
          href: `/test-suites/${testSuiteName}`
        },
        {
          text: 'Automations'
        }
      ]
    })
  }
}

async function buildScheduledTestRunsViewDetails({
  serviceTeams,
  serviceId,
  environments
}) {
  const serviceTeamIds = serviceTeams.map((team) => team.teamId)
  const [autoTestRunDetails, testSuites] = await Promise.all([
    getScheduledTestRunDetails(serviceId),
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

  const testSuiteOptions = buildTestSuiteOptions(testSuites)

  return { testSuiteOptions, rows }
}

function sortRows(rowA, rowB) {
  const aHeader = rowA.cells.find(
    ({ headers }) => headers === 'test-suite'
  )?.headers
  const bHeader = rowB.cells.find(
    ({ headers }) => headers === 'test-suite'
  )?.headers

  return aHeader.localeCompare(bHeader)
}

async function getScheduledTestRunDetails(serviceName) {
  const endpoint = portalBackendUrl + `/auto-test-runs/${serviceName}`

  const { payload } = await fetchJson(endpoint)
  return payload
}

function buildTestSuiteOptions(testSuites) {
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
