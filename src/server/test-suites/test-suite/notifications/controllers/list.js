import { fetchNotificationRules } from '#server/common/helpers/fetch/fetch-notifications.js'
import { provideFormValues } from '../../../helpers/pre/provide-form-values.js'

export default {
  options: {
    id: `test-suites/{serviceId}/notifications`,
    pre: [provideFormValues]
  },
  handler: async (request, h) => {
    const entity = request.app.entity
    const testSuiteName = entity.name
    const formValues = request.pre.formValues

    const rows = buildNotificationsViewDetails(testSuiteName)

    return h.view('test-suites/test-suite/notifications/views/notifications', {
      pageTitle: `Test Suite - ${testSuiteName} - Notifications`,
      entity,
      formValues,
      tableData: {
        headers: [
          { id: 'schedule', text: 'Schedule', width: '20' },
          { id: 'env', text: 'Env', width: '8' },
          { id: 'nextRunDate', text: 'Next run date', width: '15' },
          { id: 'cpu', text: 'CPU', width: '7' },
          { id: 'memory', text: 'Memory', width: '7' },
          { id: 'profile', text: 'Profile', width: '7' },
          { id: 'startDate', text: 'Start date', width: '10' },
          { id: 'endDate', text: 'End date', width: '10' },
          { id: 'actions', text: 'Actions', isRightAligned: true, width: '12' }
        ],
        rows,
        noResult: 'Currently you have no notifications setup'
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
          text: 'Notifications'
        }
      ]
    })
  }
}

async function buildNotificationsViewDetails(testSuiteName) {
  const notifications = await fetchNotificationRules(testSuiteName)

  const rows = notifications.map((schedule) => ({
    id: schedule.id,
    description: schedule.description,
    enabled: schedule.enabled,
    env: schedule.task.environment,
    cpu: schedule.task.cpu / 1024 + ' vCPU',
    memory: schedule.task.memory / 1024 + ' GB',
    profile: schedule.task.profile,
    startDate: schedule.config.startDate,
    endDate: schedule.config.endDate,
    nextRunDate: schedule.nextRunAt
  }))

  return rows
}
