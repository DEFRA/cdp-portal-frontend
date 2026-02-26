import Joi from 'joi'
import Boom from '@hapi/boom'

import { sessionNames } from '#server/common/constants/session-names.js'
import {
  getSchedule,
  removeSchedule
} from '#server/services/service/automations/helpers/fetchers.js'
import { provideFormValues } from '../../../helpers/pre/provide-form-values.js'

export default {
  options: {
    pre: [provideFormValues]
  },
  handler: async (request, h) => {
    const entity = request.app.entity
    const testSuiteName = entity.name
    const schedule = await getSchedule(request.params.scheduleId)

    return h.view('test-suites/test-suite/automations/views/schedules-remove', {
      pageTitle: `Test Suite - ${testSuiteName} - Automations - Schedules - Remove`,
      entity,
      schedule,
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
          text: 'Remove'
        }
      ]
    })
  }
}

export const postRemove = {
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
    const serviceId = request.params.serviceId
    const scheduleId = request.params.scheduleId

    try {
      await removeSchedule(serviceId, scheduleId)

      request.yar.flash(sessionNames.notifications, {
        text: 'Schedule removed from Test Suite',
        type: 'success'
      })

      return h.redirect(
        request.routeLookup('test-suites/{serviceId}/automations', {
          params: { serviceId }
        })
      )
    } catch (error) {
      request.yar.flash(sessionNames.globalValidationFailures, error.message)

      return h.redirect(
        request.routeLookup('test-suites/{serviceId}/automations', {
          params: { serviceId }
        })
      )
    }
  }
}
