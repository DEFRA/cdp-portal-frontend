import Joi from 'joi'

const auditSchema = Joi.object({
  cdpRequestId: Joi.string(),
  created: Joi.date().default(new Date()),
  source: Joi.string().required(),
  message: Joi.any().required().not(null), // Tighten up to string and object?
  tags: Joi.object().pattern(Joi.string(), Joi.string()).default({}) // Tighten up
})

export { auditSchema }
