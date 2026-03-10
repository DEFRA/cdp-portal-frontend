import Boom from '@hapi/boom'
import Joi from 'joi'

import { sessionNames } from '#server/common/constants/session-names.js'
import { buildErrorDetails } from '#server/common/helpers/build-error-details.js'
import { getEnvironments } from '#server/common/helpers/environments/get-environments.js'
import { testNotificationValidation } from '../../../helpers/schema/test-suite-validation.js'
import {
  createNotificationRule,
  fetchSupportedNotifications
} from '#server/common/helpers/fetch/fetch-notifications.js'

export default {
  options: {
    id: 'post:test-suites/{serviceId}/notifications/create',
    validate: {
      params: Joi.object({
        serviceId: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const userSession = request.auth.credentials
    const payload = request.payload
    const userScopes = userSession?.scope
    const serviceId = request.params.serviceId

    const sanitisedPayload = {
      eventType: payload.eventType,
      environments: payload.environments,
      channel: payload.channel
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
        await createNotificationRule(serviceId, {
          eventType: validationResult.value.eventType,
          environments: validationResult.value.environments,
          slackChannel: validationResult.value.channel
        })

        request.yar.clear(sessionNames.validationFailure)
        request.yar.flash(sessionNames.notifications, {
          text: 'Notification saved successfully',
          type: 'success'
        })
      } catch (error) {
        request.logger.error({ error }, 'Add Notification failed')
        request.yar.flash(sessionNames.validationFailure, {
          formValues: sanitisedPayload
        })
        request.yar.flash(sessionNames.globalValidationFailures, error.message)
      }
    }

    const redirectUrl = request.routeLookup(
      'test-suites/{serviceId}/notifications',
      {
        params: { serviceId }
      }
    )
    return h.redirect(redirectUrl)
  }
}
