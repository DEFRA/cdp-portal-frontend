import Joi from 'joi'

function serviceValidation(imageNames, availableVersions, environments) {
  return Joi.object({
    imageName: Joi.string()
      .valid(...imageNames)
      .messages({
        'any.only': 'Choose an entry'
      }),
    version: Joi.string()
      .valid(...availableVersions)
      .messages({
        'any.only': 'Choose an entry',
        'string.empty': 'Choose an entry' // If image name not provided, available versions is an empty array
      }),
    environment: Joi.string()
      .valid(...environments)
      .messages({
        'any.only': 'Choose an entry'
      }),
    redirectLocation: Joi.string().valid('summary', '')
  })
}

export { serviceValidation }
