import Joi from 'joi'
import Boom from '@hapi/boom'

import { sessionNames } from '../../../../../common/constants/session-names.js'
import { removeAutoTestRun } from '../../helpers/fetchers.js'
import { provideNotFoundIfPrototype } from '../../../../../common/helpers/ext/provide-not-found-if-prototype.js'
import { provideNotFoundIfNull } from '../../../../../common/helpers/ext/provide-not-found-if-null.js'
import {
  profileValidation,
  repositoryNameValidation
} from '@defra/cdp-validation-kit'

const removeTestRunController = {
  options: {
    id: 'post:services/{serviceId}/automations/test-runs/{testSuiteId}/remove',
    ext: {
      onPreAuth: [provideNotFoundIfPrototype, provideNotFoundIfNull]
    },
    validate: {
      params: Joi.object({
        serviceId: repositoryNameValidation,
        testSuiteId: repositoryNameValidation
      }),
      payload: Joi.object({
        profile: profileValidation
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const serviceId = request.params.serviceId
    const testSuiteId = request.params.testSuiteId
    const profile = request.payload.profile

    try {
      await removeAutoTestRun(serviceId, testSuiteId, profile)

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
