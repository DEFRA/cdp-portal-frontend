import Joi from 'joi'

function createServiceValidation(serviceTypes, usersTeamIds) {
  return Joi.object({
    repositoryName: Joi.string()
      .pattern(/^[\w-]*$/)
      .pattern(/^[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]$/, {
        name: 'startAndEndWithCharacter'
      })
      .min(1)
      .max(32)
      .required()
      .messages({
        'string.empty': 'Enter value',
        'string.pattern.base': 'Letters and numbers with hyphen separators',
        'string.pattern.name': 'Start and end with a character',
        'string.min': '1 character or more',
        'string.max': '32 characters or less'
      }),
    serviceType: Joi.string()
      .valid(...serviceTypes)
      .messages({
        'any.only': 'Choose an entry',
        'any.required': 'Choose an entry'
      })
      .required(),
    teamId: Joi.string()
      .valid(...usersTeamIds)
      .messages({
        'any.only': 'Choose an entry',
        'any.required': 'Choose an entry'
      })
      .required()
  })
}

export { createServiceValidation }
