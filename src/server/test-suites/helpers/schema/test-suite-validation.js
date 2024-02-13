import Joi from 'joi'

function testSuiteValidation(imageNames, environments) {
  return Joi.object({
    imageName: Joi.string()
      .valid(...imageNames)
      .required(),
    environment: Joi.string()
      .valid(...environments)
      .required()
      .messages({
        'any.only': 'Choose an entry',
        'any.required': 'Choose an entry'
      })
  })
}

export { testSuiteValidation }
