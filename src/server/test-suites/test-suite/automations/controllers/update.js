import Joi from 'joi'
import Boom from '@hapi/boom'

import { sessionNames } from '#server/common/constants/session-names.js'
import {
  getSchedule,
  updateSchedule
} from '#server/services/service/automations/helpers/fetchers.js'
import { provideFormValues } from '../../../helpers/pre/provide-form-values.js'
import { fetchTestRuns } from '#server/test-suites/helpers/fetch/fetch-test-runs.js'
import daysOfTheWeek from '#server/test-suites/constants/daysOfTheWeek.js'
import { buildOptions } from '#server/common/helpers/options/build-options.js'
import { getEnvironments } from '#server/common/helpers/environments/get-environments.js'
import {
  postProcessValidationErrors,
  testScheduleValidation
} from '#server/test-suites/helpers/schema/test-suite-validation.js'
import { buildErrorDetails } from '#server/common/helpers/build-error-details.js'
import { runnerConfigurations } from '#server/test-suites/constants/runner-configurations.js'

export default {
  options: {
    pre: [provideFormValues]
  },
  handler: async (request, h) => {
    const entity = request.app.entity
    const testSuiteName = entity.name

    const [schedule, { testRuns }] = await Promise.all([
      getSchedule(testSuiteName, request.params.scheduleId),
      fetchTestRuns({
        name: testSuiteName
      })
    ])

    const [hour, minute] = schedule.config.time.split(':')
    const startDateParts = dateToParts(schedule.config.startDate)
    const endDateParts = dateToParts(schedule.config.endDate)

    const formValues = {
      'time-hour': hour,
      'time-minute': minute,
      daysOfTheWeek: schedule.config.daysOfWeek,
      environment: schedule.task.environment,
      configuration: findConfiguration(schedule.task.cpu, schedule.task.memory),
      provideProfile: Boolean(schedule.task.profile).toString(),
      newProfile: schedule.task.profile,
      enabled: schedule.enabled,
      'startDate-day': startDateParts.day,
      'startDate-month': startDateParts.month,
      'startDate-year': startDateParts.year,
      'endDate-day': endDateParts.day,
      'endDate-month': endDateParts.month,
      'endDate-year': endDateParts.year,
      ...request.pre.formValues
    }

    formValues.daysOfTheWeekOptions = daysOfTheWeek.map((day) => ({
      value: day.toLowerCase(),
      text: day
    }))

    const profiles = [
      ...new Set(testRuns.map((t) => t.profile).filter(Boolean))
    ]
    formValues.profileOptions = buildOptions(profiles)
    if (!formValues.provideProfile) {
      formValues.provideProfile = 'false'
    }

    return h.view('test-suites/test-suite/automations/views/schedules-update', {
      pageTitle: `Test Suite - ${testSuiteName} - Automations - Schedules - Update`,
      entity,
      schedule,
      formValues,
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
          text: 'Automations',
          href: `/test-suites/${testSuiteName}/automations`
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
    id: `test-suites/{serviceId}/automations/schedules/{scheduleId}`,
    validate: {
      params: Joi.object({
        serviceId: Joi.string().required(),
        scheduleId: Joi.string().required()
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
    console.log(validationResult?.error)
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
            daysOfWeek: validationResult.value.daysOfTheWeek
          }
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
      'test-suites/{serviceId}/automations/schedules/{scheduleId}',
      {
        params: { serviceId, scheduleId }
      }
    )
    return h.redirect(redirectUrl)
  }
}

function findConfiguration(cpu, memory) {
  return Object.entries(runnerConfigurations)
    .find(
      ([_, config]) =>
        config.cpu.value === cpu && config.memory.value === memory
    )
    ?.at(0)
}

function dateToParts(isoDateString) {
  if (!isoDateString) {
    return {
      day: '',
      month: '',
      year: ''
    }
  }

  const date = new Date(isoDateString)

  return {
    day: date.getUTCDate(),
    month: date.getUTCMonth() + 1,
    year: date.getUTCFullYear()
  }
}
