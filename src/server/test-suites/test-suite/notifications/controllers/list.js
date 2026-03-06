import { formatText } from '#config/nunjucks/filters/filters.js'
import { getEnvironments } from '#server/common/helpers/environments/get-environments.js'
import { fetchNotificationRules } from '#server/common/helpers/fetch/fetch-notifications.js'
import { excludedEnvironments } from '#server/services/service/automations/helpers/constants/excluded-environments.js'
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
    const userSession = request.auth.credentials

    const environments = getEnvironments(
      userSession?.scope,
      entity?.subType
    ).filter((env) => !excludedEnvironments.includes(env.toLowerCase()))

    const rows = await buildNotificationsViewDetails(
      testSuiteName,
      environments
    )

    const supportVerticalHeadings = environments.length >= 5

    return h.view('test-suites/test-suite/notifications/views/notifications', {
      pageTitle: `Test Suite - ${testSuiteName} - Notifications`,
      entity,
      formValues,
      tableData: {
        headers: [
          { id: 'eventType', text: 'Event', width: '8' },
          { id: 'channel', text: 'Channel', width: '14' },
          ...environments.map((env) => ({
            ...(supportVerticalHeadings && { verticalText: true }),
            id: env.toLowerCase(),
            text: formatText(env),
            width: env.length
          })),
          { id: 'enabled', text: 'Enabled', width: '5' },
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

async function buildNotificationsViewDetails(testSuiteName, environments) {
  const notifications = await fetchNotificationRules(testSuiteName)

  const rows = notifications.map((notification) => ({
    id: notification.ruleId,
    eventType: notification.eventType,
    channel: notification.slackChannel,
    enabled: notification.isEnabled,
    envs: environments.map((env) => ({
      id: env.toLowerCase(),
      selected: notification.environments.includes(env)
    }))
  }))

  return rows
}
