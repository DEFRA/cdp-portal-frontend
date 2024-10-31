import Joi from 'joi'
import Boom from '@hapi/boom'

import { config } from '~/src/config/index.js'
import { sessionNames } from '~/src/server/common/constants/session-names.js'

const deleteUserController = {
  options: {
    validate: {
      params: Joi.object({
        userId: Joi.string().uuid().required()
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const userId = request.params.userId
    const deleteUserEndpointUrl =
      config.get('userServiceBackendUrl') + `/users/${userId}`

    try {
      const { response } = await request.authedFetcher(deleteUserEndpointUrl, {
        method: 'delete'
      })

      if (response?.ok) {
        request.yar.flash(sessionNames.notifications, {
          text: 'User deleted and removed from all teams',
          type: 'success'
        })

        return h.redirect('/admin/users')
      }
    } catch (error) {
      request.yar.flash(sessionNames.globalValidationFailures, error.message)

      return h.redirect(`/admin/users/${userId}/confirm-delete`)
    }
  }
}

export { deleteUserController }
