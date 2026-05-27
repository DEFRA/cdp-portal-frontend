import Joi from 'joi'
import { config } from '#config/config.js'
import { sessionNames } from '#server/common/constants/session-names.js'
import { userIdValidation } from '@defra/cdp-validation-kit'
import Boom from '@hapi/boom'

const editUserController = {
  options: {
    validate: {
      params: Joi.object({
        userId: userIdValidation
      }),
      payload: Joi.object({
        actionType: Joi.string().valid('cancel', 'save'),
        github: Joi.string().allow(''),
        githubSearch: Joi.string().allow('')
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const userId = request.params.userId
    const actionType = request.payload.actionType
    const github = request.payload.github

    if (actionType === 'cancel') {
      return h.redirect('/admin/users/' + userId)
    }

    const editUserEndpointUrl = `${config.get('userServiceBackendUrl')}/users/${
      userId
    }`

    try {
      await request.authedFetchJson(editUserEndpointUrl, {
        method: 'patch',
        payload: {
          github
        }
      })

      request.yar.flash(sessionNames.notifications, {
        text: 'User updated',
        type: 'success'
      })

      return h.redirect('/admin/users/' + userId)
    } catch (error) {
      request.yar.flash(sessionNames.globalValidationFailures, error.message)

      return h.redirect('/admin/users/' + userId)
    }
  }
}

export { editUserController }
