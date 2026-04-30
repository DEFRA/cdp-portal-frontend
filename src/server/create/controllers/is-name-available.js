import Joi from 'joi'
import Boom from '@hapi/boom'
import { repositoryNameValidation } from '@defra/cdp-validation-kit'
import { checkNameAvailability } from '#server/create/helpers/validator/check-name-availability.js'

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
    const nameIsAvailable = await repositoryNameValidation
      .trim()
      .external(checkNameAvailability)
      .validateAsync(repositoryName)
      .then(() => true)
      .catch(() => false)

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
