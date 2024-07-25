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
      .pattern(/^\w*$/)
      .pattern(/^[a-zA-Z0-9]\w*[a-zA-Z0-9]$/, {
        name: 'startAndEndWithCharacter'
      })
      .min(1)
      .max(512)
      .required()
      .messages({
        'string.pattern.base':
          'Any case letters and numbers with underscore separators',
        'string.pattern.name': 'Start and end with a letter or number',
        'string.min': validation.minCharacters(1),
        'string.max': validation.maxCharacters(512),
        'any.invalid': validation.notAllowed,
        'any.required': validation.enterValue,
        'string.empty': validation.enterValue
      }),
    secretValue: Joi.string()
      .pattern(/^\S*$/)
      .min(1)
      .max(512)
      .required()
      .messages({
        'string.pattern.base': 'Should not include spaces',
        'string.min': validation.minCharacters(1),
        'string.max': validation.maxCharacters(512),
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
