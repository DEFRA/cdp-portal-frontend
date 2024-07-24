import Joi from 'joi'

const auditMessageSchema = Joi.object({
  event: Joi.string().required(),
  data: Joi.object().optional(),
  user: Joi.object({
    id: Joi.string().optional(),
    email: Joi.string().optional(),
    displayName: Joi.string().optional()
  }).optional(),
  testRun: Joi.object().optional()
})

export { auditMessageSchema }
