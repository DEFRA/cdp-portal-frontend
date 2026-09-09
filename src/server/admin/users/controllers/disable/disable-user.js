import Joi from 'joi'
import Boom from '@hapi/boom'

import { config } from '#config/config.js'
import { sessionNames } from '#server/common/constants/session-names.js'
import { userIdValidation } from '@defra/cdp-validation-kit'

const disableUserController = {
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
    const disableUserEndpointUrl =
      config.get('userServiceBackendUrl') + `/users/${userId}/disable`

    try {
      await request.authedFetchJson(disableUserEndpointUrl, {
        method: 'patch'
      })

      request.yar.flash(sessionNames.notifications, {
        text: 'User disabled',
        type: 'success'
      })

      return h.redirect(`/admin/users/${userId}`)
    } catch (error) {
      request.yar.flash(sessionNames.globalValidationFailures, error.message)

      return h.redirect(`/admin/users/${userId}/confirm-disable`)
    }
  }
}

export { disableUserController }
