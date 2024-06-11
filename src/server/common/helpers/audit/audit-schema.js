import Joi from 'joi'

const auditSchema = Joi.object({
  id: Joi.string(),
  created: Joi.date().default(new Date()),
  source: Joi.string().required(), // maybe default this to an env var that's common to all services
  message: Joi.any().required(),
  tags: Joi.object().pattern(Joi.string(), Joi.string()).default({}) // do we want to limit keys/size etc?
})

export { auditSchema }
