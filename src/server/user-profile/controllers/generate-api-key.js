import Joi from 'joi'
import {
  environmentValidation,
  scopes,
  environments
} from '@defra/cdp-validation-kit'

import { config } from '../../../config/config.js'
import { sessionNames } from '../../common/constants/session-names.js'
import { buildErrorDetails } from '../../common/helpers/build-error-details.js'
import { validation } from '@defra/cdp-validation-kit/src/helpers/validation-messages.js'

const apiKeyValidation = Joi.object({
  environment: environmentValidation
}).messages({
  'any.only': validation.enterValue,
  'string.empty': validation.enterValue
})

const generateApiKeyController = {
  options: {
    id: 'user-profile/generate-api-key',
    auth: {
      mode: 'required',
      access: {
        scope: [scopes.tenant, scopes.admin]
      }
    }
  },
  handler: async (request, h) => {
    const { environment } = request.payload

    const validationResult = apiKeyValidation.validate(request.payload, {
      abortEarly: false
    })

    if (validationResult?.error) {
      const errorDetails = buildErrorDetails(validationResult.error.details)

      request.yar.flash(sessionNames.validationFailure, {
        formValues: { environment },
        formErrors: errorDetails
      })
    }

    if (!validationResult.error) {
      const generateEphemeralKeyUrl = `${config.get('selfServiceOpsUrl')}/ephemeral-keys/${environment}`

      try {
        const { payload } = await request.authedFetchJson(
          generateEphemeralKeyUrl,
          { method: 'post' }
        )
        const { apiKey } = payload

        request.yar.flash(sessionNames.notifications, {
          text: `Developer API key created for ${environment}. Expires in ${environment === environments.prod ? 2 : 24} hours`,
          type: 'success'
        })

        return h
          .redirect('/user-profile')
          .state('flash', { environment, apiKey })
      } catch (error) {
        request.yar.flash(sessionNames.validationFailure, {
          formValues: { environment }
        })
        request.yar.flash(sessionNames.globalValidationFailures, error.message)
      }
    }

    return h.redirect('/user-profile')
  }
}

export { generateApiKeyController }
