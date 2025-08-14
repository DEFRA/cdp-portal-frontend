import Joi from 'joi'
import { getEnvironments } from '../../../common/helpers/environments/get-environments.js'

/**
 * Validation for service params
 * @param {Record<string, string>} params
 * @param {ValidationOptions} options
 * @returns {any}
 */
function serviceParamsValidation(params, options) {
  const scopes = options.context.auth.credentials?.scope.slice()
  const entity = options.context.app?.request?.entity

  const validationResult = Joi.object({
    serviceId: Joi.string().required(),
    environment: Joi.string()
      .valid(...getEnvironments(scopes, entity?.type))
      .required()
  }).validate(params, options)

  if (validationResult?.error) {
    throw validationResult.error
  }

  return validationResult.value
}

export { serviceParamsValidation }

/**
 * import('Joi').ValidationOptions
 */
