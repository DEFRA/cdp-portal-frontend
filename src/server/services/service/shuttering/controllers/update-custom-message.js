import Joi from 'joi'
import Boom from '@hapi/boom'

import { sessionNames } from '~/src/server/common/constants/session-names.js'
import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details.js'
import { customShutteringValidation } from '~/src/server/services/service/shuttering/helpers/schema/custom-shuttering-validation.js'

const updateCustomMessageController = {
  options: {
    id: 'services/{serviceId}/shuttering/custom-message',
    validate: {
      params: Joi.object({
        serviceId: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const params = request.params
    const serviceId = params.serviceId
    const payload = request.payload
    const customHtml = payload?.customHtml

    const redirectUrl = request.routeLookup('services/{serviceId}/shuttering', {
      params: { serviceId }
    })

    const sanitisedPayload = {
      customHtml
    }

    const validationResult = customShutteringValidation.validate(
      sanitisedPayload,
      { abortEarly: false }
    )

    if (validationResult?.error) {
      const errorDetails = buildErrorDetails(validationResult.error.details)

      request.yar.flash(sessionNames.validationFailure, {
        formValues: sanitisedPayload,
        formErrors: errorDetails
      })
    }

    return h.redirect(redirectUrl)
  }
}

export { updateCustomMessageController }
