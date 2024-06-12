import Joi from 'joi'

const auditSchema = Joi.object({
  cdpRequestId: Joi.string(),
  created: Joi.date().default(new Date()),
  source: Joi.string().required(),
  message: Joi.any().required().not(null),
  tags: Joi.object().pattern(Joi.string(), Joi.string()).default({})
})

export { auditSchema }
