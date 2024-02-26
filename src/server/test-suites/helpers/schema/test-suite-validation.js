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
        'any.only': 'Choose an environment',
        'any.required': 'Choose an environment'
      })
  })
}

export { testSuiteValidation }
