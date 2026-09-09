import Joi from 'joi'
import Boom from '@hapi/boom'

import { config } from '#config/config.js'
import { sessionNames } from '#server/common/constants/session-names.js'
import { userIdValidation } from '@defra/cdp-validation-kit'

const enableUserController = {
  options: {
    validate: {
      params: Joi.object({
        userId: userIdValidation
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const userId = request.params.userId
    const enableUserEndpointUrl =
      config.get('userServiceBackendUrl') + `/users/${userId}/enable`

    try {
      await request.authedFetchJson(enableUserEndpointUrl, {
        method: 'patch'
      })

      request.yar.flash(sessionNames.notifications, {
        text: 'User enabled',
        type: 'success'
      })
    } catch (error) {
      request.yar.flash(sessionNames.globalValidationFailures, error.message)
    }

    return h.redirect(`/admin/users/${userId}`)
  }
}

export { enableUserController }
