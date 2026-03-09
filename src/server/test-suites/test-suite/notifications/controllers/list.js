import { formatText } from '#config/nunjucks/filters/filters.js'
import { getEnvironments } from '#server/common/helpers/environments/get-environments.js'
import {
  fetchNotificationRules,
  fetchSupportedNotifications
} from '#server/common/helpers/fetch/fetch-notifications.js'
import { buildOptions } from '#server/common/helpers/options/build-options.js'
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

    const environments = getEnvironments(userSession?.scope, entity?.subType)

    const [rows, notificationTypes] = await Promise.all([
      buildNotificationsRow(testSuiteName, environments),
      fetchSupportedNotifications(testSuiteName)
    ])

    formValues.eventTypeOptions = buildOptions(
      notificationTypes.map((notificationType) => ({
        value: notificationType.eventType,
        text: notificationType.eventType
      })),
      false
    ).map((option) => ({
      ...option,
      selected: option.value === 'testfailed'
    }))

    const supportVerticalHeadings = environments.length >= 5

    return h.view('test-suites/test-suite/notifications/views/notifications', {
      pageTitle: `Test Suite - ${testSuiteName} - Notifications`,
      entity,
      formValues,
      tableData: {
        headers: [
          { id: 'eventType', text: 'Event', width: '10' },
          { id: 'channel', text: 'Channel', width: '12' },
          ...environments.map((env) => ({
            ...(supportVerticalHeadings && { verticalText: true }),
            id: env.toLowerCase(),
            text: formatText(env),
            width: env.length
          })),
          { id: 'enabled', text: 'Enabled', width: '6' },
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

async function buildNotificationsRow(testSuiteName, environments) {
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
