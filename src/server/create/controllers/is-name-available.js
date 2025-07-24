import Joi from 'joi'
import Boom from '@hapi/boom'
import { checkNameIsAvailable } from '../helpers/validator/check-name-is-available.js'

const isNameAvailableController = {
  options: {
    validate: {
      params: Joi.object({
        repositoryName: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const repositoryName = request.params?.repositoryName
    const nameIsAvailable = await checkNameIsAvailable(repositoryName)

    if (nameIsAvailable) {
      return h.response({
        message: 'success',
        isAvailable: true
      })
    }

    return h.response({
      message: 'success',
      isAvailable: false
    })
  }
}

export { isNameAvailableController }
