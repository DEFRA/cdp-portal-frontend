import Joi from 'joi'
import { omit } from 'lodash'

import { config, environments } from '~/src/config'
import { validation } from '~/src/server/common/constants/validation'

function secretValidation(teamId) {
  const platformGlobalSecretKeys = config.get('platformGlobalSecretKeys')

  const adminTeamId = config.get('oidcAdminGroupId')
  const schema = {
    secretKey: Joi.string()
      .not(...platformGlobalSecretKeys)
      .min(1)
      .max(256)
      .required()
      .messages({
        'string.min': validation.minCharacters(1),
        'string.max': validation.maxCharacters(256),
        'any.invalid': validation.notAllowed,
        'any.required': validation.enterValue,
        'string.empty': validation.enterValue
      }),
    secretValue: Joi.string()
      .min(1)
      .max(256)
      .required()
      .messages({
        'string.min': validation.minCharacters(1),
        'string.max': validation.maxCharacters(256),
        'any.required': validation.enterValue,
        'string.empty': validation.enterValue
      }),
    teamId: Joi.string().uuid().required()
  }
  let acceptableEnvironments

  if (teamId === adminTeamId) {
    acceptableEnvironments = {
      environment: Joi.string()
        .valid(...Object.values(environments))
        .required()
        .messages({
          'string.base': validation.chooseUser,
          'any.only': validation.choose('environment'),
          'any.required': validation.choose('environment')
        })
    }
  }

  if (teamId !== adminTeamId) {
    acceptableEnvironments = {
      environment: Joi.string()
        .valid(...Object.values(omit(environments, ['management', 'infraDev'])))
        .required()
        .messages({
          'string.base': validation.choose('environment'),
          'any.only': validation.choose('environment'),
          'any.required': validation.choose('environment')
        })
    }
  }

  return Joi.object({
    ...schema,
    ...acceptableEnvironments
  })
}

export { secretValidation }
