import Joi from 'joi'

import { validation } from '../../../../../common/constants/validation.js'
import { getEnvironments } from '../../../../../common/helpers/environments/get-environments.js'
import { excludedEnvironments } from '../constants/excluded-environments.js'

// TODO
//  Validate:
//  - test suite is a tes suite owned by the team that owns the service
//  - do we need messages here? Are they being used anywhere?

function autoTestRunValidation(scopes) {
  const allowedEnvironments = getEnvironments(scopes).filter(
    (env) => !excludedEnvironments.includes(env)
  )

  return Joi.object({
    serviceId: Joi.string().required().messages({
      'string.empty': validation.enterValue,
      'any.required': validation.enterValue
    }),
    testSuite: Joi.string().required().messages({
      'string.empty': validation.enterValue,
      'any.required': validation.enterValue
    }),
    environments: Joi.array()
      .items(Joi.string().valid(...allowedEnvironments))
      .messages({
        'any.only': 'Environment is not available for this service'
      })
  })
}

export { autoTestRunValidation }
