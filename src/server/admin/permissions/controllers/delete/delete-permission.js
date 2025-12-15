import Joi from 'joi'
import Boom from '@hapi/boom'

import { sessionNames } from '../../../../common/constants/session-names.js'
import { deleteScope } from '../../helpers/fetchers.js'

const deletePermissionController = {
  options: {
    validate: {
      params: Joi.object({
        scopeId: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
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
        event: `permission: ${scopeId} deleted`,
        data: { scopeId }
      })

      return h.redirect('/admin/permissions')
    } catch (error) {
      request.yar.flash(sessionNames.globalValidationFailures, error.message)

      return h.redirect(`/admin/permissions/${scopeId}/confirm-delete`)
    }
  }
}

export { deletePermissionController }
