import Joi from 'joi'

function optionsValidation(availableInstances, availableCpu, availableMemory) {
  return Joi.object({
    instanceCount: Joi.string()
      .valid(...availableInstances.map(String))
      .messages({
        'any.only': 'Choose an entry',
        'string.empty': 'Choose an entry'
      }),
    cpu: Joi.string()
      .valid(...availableCpu.map(String))
      .messages({
        'any.only': 'Choose an entry',
        'string.empty': 'Choose an entry'
      }),
    memory: Joi.string()
      .valid(...availableMemory.map(String))
      .messages({
        'any.only': 'Choose an entry',
        'string.empty': 'Choose an entry'
      }),
    redirectLocation: Joi.string().valid('summary', '')
  })
}

export { optionsValidation }
