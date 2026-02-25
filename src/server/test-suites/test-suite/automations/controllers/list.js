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
          { id: 'env', text: 'Env', width: '7' },
          { id: 'cpu', text: 'CPU', width: '5' },
          { id: 'memory', text: 'Memory', width: '5' },
          { id: 'profile', text: 'Profile', width: '5' },
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
  const schedules = await getSchedules()

  const rows = schedules.map((schedule) => ({
    id: schedule.id,
    description: schedule.description,
    env: schedule.task.environment,
    cpu: schedule.task.cpu / 1024 + ' vCPU',
    memory: schedule.task.memory / 1024 + ' GB',
    profile: schedule.task.profile,
    startDate: schedule.config.startDate,
    endDate: schedule.config.endDate
  }))

  return { rows }
}
