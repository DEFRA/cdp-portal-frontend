import Joi from 'joi'

import { getEnvironmentsByTeam } from '~/src/server/common/helpers/environments/get-environments-by-team.js'

/**
 * Validation for secret params
 * @param {Record<string, string>} params
 * @param {ValidationOptions} options
 * @returns {any}
 */
function secretParamsValidation(params, options) {
  const service = options.context.app.request.service

  const validationResult = Joi.object({
    serviceId: Joi.string().required(),
    environment: Joi.string()
      .valid(...Object.values(getEnvironmentsByTeam(service?.teams ?? [])))
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
