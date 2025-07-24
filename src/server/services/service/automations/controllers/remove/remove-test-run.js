import Joi from 'joi'
import Boom from '@hapi/boom'

import { sessionNames } from '../../../../../common/constants/session-names.js'
import { removeAutoTestRun } from '../../helpers/fetchers.js'

const removeTestRunController = {
  options: {
    id: 'post:services/{serviceId}/automations/test-runs/{testSuiteId}/remove',
    validate: {
      params: Joi.object({
        serviceId: Joi.string().required(),
        testSuiteId: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const serviceId = request.params.serviceId
    const testSuiteId = request.params.testSuiteId

    try {
      await removeAutoTestRun(serviceId, testSuiteId)

      request.yar.flash(sessionNames.notifications, {
        text: 'Test run removed from service',
        type: 'success'
      })

      return h.redirect(
        request.routeLookup('services/{serviceId}/automations/test-runs', {
          params: { serviceId }
        })
      )
    } catch (error) {
      request.yar.flash(sessionNames.globalValidationFailures, error.message)

      return h.redirect(
        request.routeLookup(
          'services/{serviceId}/automations/test-runs/{testSuiteId}/remove',
          { params: { serviceId, testSuiteId } }
        )
      )
    }
  }
}

export { removeTestRunController }
