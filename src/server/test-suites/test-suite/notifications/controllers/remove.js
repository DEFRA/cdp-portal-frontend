import Joi from 'joi'
import Boom from '@hapi/boom'

import { sessionNames } from '#server/common/constants/session-names.js'
import { provideFormValues } from '../../../helpers/pre/provide-form-values.js'
import {
  fetchNotificationRule,
  deleteNotificationRule
} from '#server/common/helpers/fetch/fetch-notifications.js'

export default {
  options: {
    pre: [provideFormValues]
  },
  handler: async (request, h) => {
    const entity = request.app.entity
    const testSuiteName = entity.name
    const notification = await fetchNotificationRule(
      testSuiteName,
      request.params.notificationId
    )

    return h.view('test-suites/test-suite/notifications/views/remove', {
      pageTitle: `Test Suite - ${testSuiteName} - Notifications - Remove`,
      entity,
      notification,
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
        notificationId: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const serviceId = request.params.serviceId
    const notificationId = request.params.notificationId

    try {
      await deleteNotificationRule(serviceId, notificationId)

      request.yar.flash(sessionNames.notifications, {
        text: 'Notification removed from Test Suite',
        type: 'success'
      })

      return h.redirect(
        request.routeLookup('test-suites/{serviceId}/notifications', {
          params: { serviceId }
        })
      )
    } catch (error) {
      request.yar.flash(sessionNames.globalValidationFailures, error.message)

      return h.redirect(
        request.routeLookup('test-suites/{serviceId}/notifications', {
          params: { serviceId }
        })
      )
    }
  }
}
