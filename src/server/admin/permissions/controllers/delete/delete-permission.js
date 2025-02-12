import Joi from 'joi'
import Boom from '@hapi/boom'

import { sessionNames } from '~/src/server/common/constants/session-names.js'
import { deleteScope } from '~/src/server/admin/permissions/helpers/fetchers.js'
import { provideAuthedUser } from '~/src/server/common/helpers/auth/pre/provide-authed-user.js'

const deletePermissionController = {
  options: {
    validate: {
      params: Joi.object({
        scopeId: Joi.objectId().required()
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    },
    pre: [provideAuthedUser]
  },
  handler: async (request, h) => {
    const scopeId = request.params.scopeId

    try {
      await deleteScope(request, scopeId)

      request.yar.flash(sessionNames.notifications, {
        text: 'Permission deleted and removed from all teams',
        type: 'success'
      })

      request.audit.sendMessage({
        event: `permission: ${scopeId} delete by ${request.pre.authedUser.id}:${request.pre.authedUser.email}`,
        data: {
          scopeId
        },
        user: request.pre.authedUser
      })

      return h.redirect('/admin/permissions')
    } catch (error) {
      request.yar.flash(sessionNames.globalValidationFailures, error.message)

      return h.redirect(`/admin/permissions/${scopeId}/confirm-delete`)
    }
  }
}

export { deletePermissionController }
