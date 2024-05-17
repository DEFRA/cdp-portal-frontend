import Joi from 'joi'

function serviceValidation(
  imageNames,
  availableVersions,
  environments,
  buttonValue
) {
  // No clientside js fallback search
  if (buttonValue === 'search') {
    return Joi.object({
      imageName: Joi.string()
        .valid(...imageNames)
        .required()
        .messages({
          'any.only': 'Choose an entry',
          'any.required': 'Choose an entry',
          'string.empty': 'Choose an entry'
        }),
      version: Joi.string().allow(null, ''),
      environment: Joi.string()
        .valid(...environments)
        .allow(null, ''),
      button: Joi.string().valid('search'),
      redirectLocation: Joi.string().valid('summary', '')
    })
  }

  return Joi.object({
    imageName: Joi.string()
      .valid(...imageNames)
      .required()
      .messages({
        'any.only': 'Choose an entry',
        'any.required': 'Choose an entry',
        'string.empty': 'Choose an entry'
      }),
    version: Joi.string()
      .valid(...availableVersions)
      .required()
      .messages({
        'any.valid': 'Choose an entry',
        'any.only': 'Choose an entry',
        'any.required': 'Choose an entry',
        'string.empty': 'Choose an entry' // If image name not provided, available versions is an empty array
      }),
    environment: Joi.string()
      .valid(...environments)
      .required()
      .messages({
        'any.only': 'Choose an entry',
        'any.required': 'Choose an entry'
      }),
    button: Joi.string().valid('submit'),
    redirectLocation: Joi.string().valid('summary', '')
  })
}

export { serviceValidation }
