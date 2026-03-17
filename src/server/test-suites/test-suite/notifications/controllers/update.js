import Joi from 'joi'
import Boom from '@hapi/boom'

import { sessionNames } from '#server/common/constants/session-names.js'
import { buildOptions } from '#server/common/helpers/options/build-options.js'
import { getEnvironments } from '#server/common/helpers/environments/get-environments.js'
import { testNotificationValidation } from '#server/test-suites/helpers/schema/test-suite-validation.js'
import { buildErrorDetails } from '#server/common/helpers/build-error-details.js'
import {
  fetchNotificationRule,
  fetchSupportedNotifications,
  updateNotificationRule
} from '#server/common/helpers/fetch/fetch-notifications.js'
import { formatText } from '#config/nunjucks/filters/filters.js'

export default {
  options: {
    id: 'test-suites/{serviceId}/notifications/{notificationId}/update'
  },
  handler: async (request, h) => {
    const entity = request.app.entity
    const testSuiteName = entity.name
    const userSession = request.auth.credentials

    const environments = getEnvironments(userSession?.scope, entity?.subType)

    const [notification, notificationTypes] = await Promise.all([
      fetchNotificationRule(testSuiteName, request.params.notificationId),
      fetchSupportedNotifications(testSuiteName)
    ])

    const formValues = {
      eventType: notification.eventType,
      environments: notification.environments,
      channel: notification.slackChannel,
      enabled: notification.isEnabled,
      ...request.pre.formValues
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

    return h.view('test-suites/test-suite/notifications/views/update', {
      pageTitle: `Test Suite - ${testSuiteName} - Notifications - Update`,
      entity,
      notification,
      formValues,
      eventTypeOptions,
      environmentOptions,
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
          text: 'Notifications',
          href: `/test-suites/${testSuiteName}/notifications`
        },
        {
          text: 'Update'
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
      request.routeLookup(
        'test-suites/{serviceId}/notifications/{notificationId}/update',
        {
          params: {
            serviceId: request.params.serviceId,
            notificationId: request.params.notificationId
          }
        }
      )
    )
  }
}

export const postUpdate = {
  options: {
    id: `test-suites/{serviceId}/notifications/{notificationId}/update/action`,
    validate: {
      params: Joi.object({
        serviceId: Joi.string().required(),
        notificationId: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const userSession = request.auth.credentials
    const payload = request.payload
    const userScopes = userSession?.scope
    const serviceId = request.params.serviceId
    const notificationId = request.params.notificationId

    const sanitisedPayload = {
      eventType: payload.eventType,
      environments: Array.isArray(payload.environments)
        ? payload.environments
        : [payload.environments].filter(Boolean),
      channel: payload.channel,
      enabled: payload.enabled
    }

    const environments = getEnvironments(userScopes)
    const notificationTypes = await fetchSupportedNotifications(serviceId)

    const eventEnvironments = notificationTypes.find(
      (type) => type.eventType === sanitisedPayload.eventType
    ).environments
    const validEnvironments = environments.filter((env) =>
      eventEnvironments.includes(env)
    )

    const validationResult = testNotificationValidation(
      notificationTypes.map((type) => type.eventType),
      validEnvironments
    ).validate(sanitisedPayload, { abortEarly: false })

    if (validationResult?.error) {
      const errorDetails = buildErrorDetails(validationResult.error.details)
      request.yar.flash(sessionNames.validationFailure, {
        formValues: sanitisedPayload,
        formErrors: errorDetails
      })
    } else {
      try {
        await updateNotificationRule(serviceId, notificationId, {
          eventType: validationResult.value.eventType,
          environments: validationResult.value.environments,
          slackChannel: validationResult.value.channel,
          isEnabled: validationResult.value.enabled
        })

        request.yar.clear(sessionNames.validationFailure)
        request.yar.flash(sessionNames.notifications, {
          text: 'Scheduled test runs updated successfully',
          type: 'success'
        })
      } catch (error) {
        request.logger.error({ error }, 'Update Scheduled test run failed')
        request.yar.flash(sessionNames.validationFailure, {
          formValues: sanitisedPayload
        })
        request.yar.flash(sessionNames.globalValidationFailures, error.message)
      }
    }

    const redirectUrl = request.routeLookup(
      'test-suites/{serviceId}/notifications',
      {
        params: { serviceId, notificationId }
      }
    )
    return h.redirect(redirectUrl)
  }
}
