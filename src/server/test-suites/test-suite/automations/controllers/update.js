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

export default {
  options: {
    pre: [provideFormValues]
  },
  handler: async (request, h) => {
    const entity = request.app.entity
    const testSuiteName = entity.name
    const schedule = await getSchedule(testSuiteName, request.params.scheduleId)

    const formValues = request.pre.formValues

    formValues.daysOfTheWeekOptions = daysOfTheWeek.map((day) => ({
      value: day.toLowerCase(),
      text: day
    }))

    const { testRuns } = await fetchTestRuns({
      name: testSuiteName
    })

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
    validate: {
      params: Joi.object({
        serviceId: Joi.string().required(),
        scheduleId: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const testSuiteName = request.params.serviceId
    const scheduleId = request.params.scheduleId

    try {
      // await updateSchedule(request, testSuiteName, scheduleId)

      request.yar.flash(sessionNames.notifications, {
        text: 'Schedule updated',
        type: 'success'
      })

      return h.redirect(
        request.routeLookup('test-suites/{serviceId}/automations', {
          params: { testSuiteName }
        })
      )
    } catch (error) {
      request.yar.flash(sessionNames.globalValidationFailures, error.message)

      return h.redirect(
        request.routeLookup('test-suites/{serviceId}/automations', {
          params: { testSuiteName }
        })
      )
    }
  }
}
