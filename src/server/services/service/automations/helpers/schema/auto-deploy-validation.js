import Joi from 'joi'

import { validation } from '../../../../../common/constants/validation.js'
import { getEnvironments } from '../../../../../common/helpers/environments/get-environments.js'

function autoDeployValidation(scopes) {
  const allowedEnvironments = getEnvironments(scopes).filter(
    (env) => env !== 'prod'
  )

  return Joi.object({
    serviceId: Joi.string().required().messages({
      'string.empty': validation.enterValue
    }),
    environments: Joi.array()
      .items(Joi.string().valid(...allowedEnvironments))
      .messages({
        'any.only': 'Environment is not available for this service'
      })
  })
}

export { autoDeployValidation }
