import { config } from '#config/config.js'
import { formatText } from '#config/nunjucks/filters/filters.js'
import { getEnvironments } from '#server/common/helpers/environments/get-environments.js'
import { excludedEnvironments } from '#server/services/service/automations/helpers/constants/excluded-environments.js'
import { renderTestSuiteTagHtml } from '#server/services/service/automations/helpers/render-test-suite-tag-html.js'
import { buildSuggestions } from '#server/common/components/autocomplete/helpers/build-suggestions.js'
import { buildOptions } from '#server/common/helpers/options/build-options.js'
import { sortBy } from '#server/common/helpers/sort/sort-by.js'
import { testKind } from '#server/test-suites/constants/test-kind.js'
import { getSchedules } from '#server/services/service/automations/helpers/fetchers.js'
import { provideFormValues } from '../../../helpers/pre/provide-form-values.js'

export default {
  options: {
    id: `test-suites/{serviceId}/automations`,
    pre: [provideFormValues]
  },
  handler: async (request, h) => {
    const entity = request.app.entity
    const testSuiteName = entity.name
    const userSession = request.auth.credentials
    const serviceId = request.params.serviceId
    const serviceTeams = entity?.teams
    const formValues = request.pre.formValues

    const { rows } = await buildScheduledTestRunsViewDetails({
      serviceTeams
    })

    return h.view('test-suites/test-suite/automations/views/automations', {
      pageTitle: `Test Suite - ${testSuiteName} - Automations`,
      entity,
      formValues,
      tableData: {
        headers: [
          { id: 'schedule', text: 'Schedule', width: '10' },
          { id: 'env', text: 'Environment', width: '10' },
          { id: 'startDate', text: 'Start date', width: '10' },
          { id: 'endDate', text: 'End date', width: '10' }
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

async function buildScheduledTestRunsViewDetails({ serviceTeams }) {
  const serviceTeamIds = serviceTeams.map((team) => team.teamId)
  const schedules = await getSchedules()

  const rows = schedules.map((schedule) => ({
    id: schedule.id,
    description: schedule.description,
    env: schedule.task.environment,
    startDate: schedule.config.startDate,
    endDate: schedule.config.endDate
  }))
  // .map(rowBuilder)
  // .toSorted(sortRows)
  console.table(rows)

  return { rows }
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
