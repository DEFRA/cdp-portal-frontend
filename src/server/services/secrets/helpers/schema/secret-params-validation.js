import Joi from 'joi'
import { getEnvironments } from '~/src/server/common/helpers/environments/get-environments.js'

/**
 * Validation for secret params
 * @param {Record<string, string>} params
 * @param {ValidationOptions} options
 * @returns {any}
 */
function secretParamsValidation(params, options) {
  const scopes = options.context.auth.credentials?.scope.slice()

  const validationResult = Joi.object({
    serviceId: Joi.string().required(),
    environment: Joi.string()
      .valid(...getEnvironments(scopes))
      .required()
  }).validate(params, options)

  if (validationResult?.error) {
    throw validationResult.error
  }

  return validationResult.value
}

export { secretParamsValidation }

/**
 * import('Joi').ValidationOptions
 */
