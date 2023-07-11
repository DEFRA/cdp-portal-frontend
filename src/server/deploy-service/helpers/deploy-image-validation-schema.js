import Joi from 'joi'

const environments = [
  'snd',
  'management',
  'infra-dev',
  'development',
  'test',
  'perf-test',
  'production'
]

function deployImageValidationSchema(imageNames, availableVersions) {
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
    instances: Joi.number()
      .messages({ 'any.only': 'Choose how many instances' })
      .required(),
    cpu: Joi.number()
      .messages({ 'any.only': 'Choose how much cpu' })
      .required(),
    memory: Joi.number()
      .messages({ 'any.only': 'Choose how much memory' })
      .required()
  })
}

export { deployImageValidationSchema }
