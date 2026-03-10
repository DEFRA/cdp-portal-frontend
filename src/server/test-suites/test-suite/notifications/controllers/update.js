import Joi from 'joi'
import Boom from '@hapi/boom'

import { sessionNames } from '#server/common/constants/session-names.js'
import { provideFormValues } from '../../../helpers/pre/provide-form-values.js'
import daysOfTheWeek from '#server/test-suites/constants/daysOfTheWeek.js'
import { buildOptions } from '#server/common/helpers/options/build-options.js'
import { getEnvironments } from '#server/common/helpers/environments/get-environments.js'
import {
  postProcessValidationErrors,
  testScheduleValidation
} from '#server/test-suites/helpers/schema/test-suite-validation.js'
import { buildErrorDetails } from '#server/common/helpers/build-error-details.js'
import { runnerConfigurations } from '#server/test-suites/constants/runner-configurations.js'
import {
  fetchNotificationRule,
  fetchSupportedNotifications
} from '#server/common/helpers/fetch/fetch-notifications.js'
import { formatText } from '#config/nunjucks/filters/filters.js'

export default {
  options: {
    pre: [provideFormValues]
  },
  handler: async (request, h) => {
    const entity = request.app.entity
    const testSuiteName = entity.name
    const formValues = { ...request.pre.formValues, ...request.query }
    const userSession = request.auth.credentials

    const environments = getEnvironments(userSession?.scope, entity?.subType)

    const [notification, notificationTypes] = await Promise.all([
      fetchNotificationRule(testSuiteName, request.params.notificationId),
      fetchSupportedNotifications(testSuiteName)
    ])

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

export const postUpdate = {
  options: {
    id: `test-suites/{serviceId}/notifications/{notificationId}`,
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
    const scheduleId = request.params.scheduleId

    const sanitisedPayload = {
      frequency: payload.frequency,
      'time-hour': payload['time-hour'],
      'time-minute': payload['time-minute'],
      daysOfTheWeek: Array.isArray(payload.daysOfTheWeek)
        ? payload.daysOfTheWeek
        : [payload.daysOfTheWeek].filter(Boolean),
      environment: payload.environment,
      configuration: payload.configuration,
      provideProfile: payload.provideProfile,
      profile: payload.profile,
      newProfile: payload.newProfile,
      enabled: payload.enabled,
      'startDate-day': payload['startDate-day'],
      'startDate-month': payload['startDate-month'],
      'startDate-year': payload['startDate-year'],
      'endDate-day': payload['endDate-day']
        ? payload['endDate-day']
        : undefined,
      'endDate-month': payload['endDate-month']
        ? payload['endDate-month']
        : undefined,
      'endDate-year': payload['endDate-year']
        ? payload['endDate-year']
        : undefined
    }

    const environments = getEnvironments(userScopes)

    const validationResult = testScheduleValidation(
      environments,
      daysOfTheWeek
    ).validate(sanitisedPayload, { abortEarly: false })

    if (validationResult?.error) {
      postProcessValidationErrors(validationResult)
      const errorDetails = buildErrorDetails(validationResult.error.details)
      request.yar.flash(sessionNames.validationFailure, {
        formValues: sanitisedPayload,
        formErrors: errorDetails
      })
    } else {
      try {
        const profile = validationResult.value.provideProfile
          ? validationResult.value.profile &&
            validationResult.value.profile.trim() !== ''
            ? validationResult.value.profile
            : validationResult.value.newProfile
          : undefined

        const { cpu, memory } =
          runnerConfigurations[validationResult.value.configuration]

        await updateSchedule(
          request,
          serviceId,
          scheduleId,
          {
            type: 'DeployTestSuite',
            environment: validationResult.value.environment,
            cpu: cpu.value,
            memory: memory.value,
            profile
          },
          {
            frequency: validationResult.value.frequency,
            time: `${String(validationResult.value['time-hour']).padStart(2, 0)}:${String(validationResult.value['time-minute']).padStart(2, 0)}`,
            daysOfWeek: validationResult.value.daysOfTheWeek,
            startDate: validationResult.value.startDate,
            endDate: validationResult.value.endDate
          },
          validationResult.value.enabled
        )

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
      'test-suites/{serviceId}/automations/notificationId/{notificationId}',
      {
        params: { serviceId, notificationId }
      }
    )
    return h.redirect(redirectUrl)
  }
}
