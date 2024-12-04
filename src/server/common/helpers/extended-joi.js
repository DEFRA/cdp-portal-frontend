import Joi from 'joi'
import JoiObjectId from 'joi-objectid'

Joi.objectId = JoiObjectId(Joi)

export default Joi
