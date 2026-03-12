import { formatText } from '#config/nunjucks/filters/filters.js'
import { getEnvironments } from '#server/common/helpers/environments/get-environments.js'
import {
  fetchNotificationRules,
  fetchSupportedNotifications
} from '#server/common/helpers/fetch/fetch-notifications.js'
import { buildOptions } from '#server/common/helpers/options/build-options.js'
import Boom from '@hapi/boom'
import Joi from 'joi'
import { sessionNames } from '#server/common/constants/session-names.js'

export default {
  options: {
    id: `test-suites/{serviceId}/notifications`,
    validate: {
      query: Joi.object({
        eventType: Joi.string().optional()
      }).unknown(),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const entity = request.app.entity
    const testSuiteName = entity.name
    const formValues = { ...request.pre.formValues }
    const userSession = request.auth.credentials

    const environments = getEnvironments(userSession?.scope, entity?.subType)

    const [rows, notificationTypes] = await Promise.all([
      buildNotificationsRow(testSuiteName, environments),
      fetchSupportedNotifications(testSuiteName)
    ])

    if (!formValues.eventType) {
      formValues.eventType = 'testfailed' // default
    }

    const eventEnvironments = notificationTypes.find(
      (type) => type.eventType === formValues.eventType
    ).environments
    const validEnvironments = environments.filter((env) =>
      eventEnvironments.includes(env)
    )
    const environmentOptions = buildOptions(
      validEnvironments.map((environment) => ({
        text: formatText(environment),
        value: environment
      })),
      false
    )

    const eventTypeOptions = buildOptions(
      notificationTypes.map((notificationType) => ({
        value: notificationType.eventType,
        text: notificationType.eventType
      })),
      false
    )

    const supportVerticalHeadings = environments.length >= 5

    return h.view('test-suites/test-suite/notifications/views/notifications', {
      pageTitle: `Test Suite - ${testSuiteName} - Notifications`,
      entity,
      formValues,
      eventTypeOptions,
      environmentOptions,
      tableData: {
        headers: [
          { id: 'eventType', text: 'Event', width: '10' },
          { id: 'channel', text: 'Slack channel', width: '12' },
          ...environments.map((env) => ({
            ...(supportVerticalHeadings && { verticalText: true }),
            id: env.toLowerCase(),
            text: formatText(env),
            width: env.length
          })),
          { id: 'status', text: 'Status', width: '6' },
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

export const refresh = {
  handler: async (request, h) => {
    request.yar.flash(sessionNames.validationFailure, {
      formValues: request.payload
    })

    return h.redirect(
      request.routeLookup('test-suites/{serviceId}/notifications', {
        params: { serviceId: request.params.serviceId }
      })
    )
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
