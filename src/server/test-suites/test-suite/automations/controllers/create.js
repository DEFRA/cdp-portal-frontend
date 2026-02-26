import Boom from '@hapi/boom'
import Joi from 'joi'

import { sessionNames } from '#server/common/constants/session-names.js'
import { buildErrorDetails } from '#server/common/helpers/build-error-details.js'
import { getEnvironments } from '#server/common/helpers/environments/get-environments.js'
import {
  testScheduleValidation,
  postProcessValidationErrors
} from '../../../helpers/schema/test-suite-validation.js'
import { createSchedule } from '#server/services/service/automations/helpers/fetchers.js'
import { runnerConfigurations } from '../../../constants/runner-configurations.js'
import daysOfTheWeek from '#server/test-suites/constants/daysOfTheWeek.js'

export default {
  options: {
    id: 'post:test-suites/{serviceId}/automations/create-schedule',
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
      frequency: payload.frequency,
      daysOfTheWeek: Array.isArray(payload.daysOfTheWeek)
        ? payload.daysOfTheWeek
        : [payload.daysOfTheWeek].filter(Boolean),
      environment: payload.environment,
      configuration: payload.configuration,
      provideProfile: payload.provideProfile,
      profile: payload.profile,
      newProfile: payload.newProfile
    }

    const environments = getEnvironments(userScopes)

    const validationResult = testScheduleValidation(
      environments,
      daysOfTheWeek
    ).validate(sanitisedPayload, { abortEarly: false })

    if (validationResult?.error) {
      postProcessValidationErrors(validationResult)
      const errorDetails = buildErrorDetails(validationResult.error.details)
      console.log(sanitisedPayload, errorDetails)
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

        await createSchedule(
          'platform', // TODO: Fetch from user or remove?
          {
            type: 'DeployTestSuite',
            testSuite: serviceId,
            environment: validationResult.value.environment,
            cpu: cpu.value,
            memory: memory.value,
            profile
          },
          {
            frequency: validationResult.value.frequency, // TODO: handle diff frequencies
            every: {
              unit: validationResult.value.intervalUnit,
              value: validationResult.value.intervalValue
            }
          }
        )

        request.yar.clear(sessionNames.validationFailure)
        request.yar.flash(sessionNames.notifications, {
          text: 'Scheduled test runs saved successfully',
          type: 'success'
        })
      } catch (error) {
        request.logger.error({ error }, 'Add Scheduled test run failed')
        request.yar.flash(sessionNames.validationFailure, {
          formValues: sanitisedPayload
        })
        request.yar.flash(sessionNames.globalValidationFailures, error.message)
      }
    }

    const redirectUrl = request.routeLookup(
      'test-suites/{serviceId}/automations',
      {
        params: { serviceId }
      }
    )
    return h.redirect(redirectUrl)
  }
}
