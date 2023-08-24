import Joi from 'joi'

function addUserValidation(buttonValue) {
  if (buttonValue === 'search') {
    return Joi.object({
      cdpUserQuery: Joi.string().required().messages({
        'any.required': 'Enter value',
        'string.empty': 'Enter value'
      })
    })
  }

  return Joi.object({
    cdpUserQuery: Joi.string().required().messages({
      'any.required': 'Enter value',
      'string.empty': 'Enter value'
    }),
    userIds: Joi.when('cdpUserQuery', {
      is: Joi.string(),
      then: Joi.array().items(Joi.string()).single().required()
    }).messages({
      'string.base': 'Choose a user',
      'any.required': 'Choose a user'
    })
  })
}

export { addUserValidation }
