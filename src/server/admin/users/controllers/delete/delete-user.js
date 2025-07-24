import Joi from 'joi'
import Boom from '@hapi/boom'

import { config } from '../../../../../config/config.js'
import { sessionNames } from '../../../../common/constants/session-names.js'
import { userIdValidation } from '@defra/cdp-validation-kit/src/validations.js'

const deleteUserController = {
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
    const deleteUserEndpointUrl =
      config.get('userServiceBackendUrl') + `/users/${userId}`

    try {
      await request.authedFetchJson(deleteUserEndpointUrl, {
        method: 'delete'
      })

      request.yar.flash(sessionNames.notifications, {
        text: 'User deleted and removed from all teams',
        type: 'success'
      })

      return h.redirect('/admin/users')
    } catch (error) {
      request.yar.flash(sessionNames.globalValidationFailures, error.message)

      return h.redirect(`/admin/users/${userId}/confirm-delete`)
    }
  }
}

export { deleteUserController }
