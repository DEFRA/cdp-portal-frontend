import Joi from 'joi'

function createServiceValidationSchema(serviceTypes, owningTeams) {
  return Joi.object({
    repositoryName: Joi.string()
      .pattern(/^[\w-]*$/)
      .pattern(/^[a-zA-Z0-9][\w-]*[a-zA-Z0-9]$/, {
        name: 'startAndEndWithCharacter'
      })
      .min(1)
      .max(96)
      .required()
      .messages({
        'string.empty': 'Enter a value',
        'string.pattern.base':
          'Letters and numbers with hyphen or underscore separators',
        'string.pattern.name': 'Start and end with a character',
        'string.min': '1 character or more',
        'string.max': '96 characters or less'
      }),
    serviceType: Joi.string()
      .valid(...serviceTypes)
      .messages({
        'any.only': 'Choose an entry'
      }),
    owningTeam: Joi.string()
      .valid(...owningTeams)
      .messages({
        'any.only': 'Choose an entry'
      })
  })
}

export { createServiceValidationSchema }
