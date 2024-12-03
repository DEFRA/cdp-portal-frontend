import Joi from 'joi'
import Boom from '@hapi/boom'

import { sessionNames } from '~/src/server/common/constants/session-names.js'
import { deleteScope } from '~/src/server/admin/permissions/helpers/fetchers.js'

const deletePermissionController = {
  options: {
    validate: {
      params: Joi.object({
        scopeId: Joi.objectId().required()
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const scopeId = request.params.scopeId

    try {
      const response = await deleteScope(request, scopeId)

      if (response.ok) {
        request.yar.flash(sessionNames.notifications, {
          text: 'Permission deleted and removed from all teams',
          type: 'success'
        })

        return h.redirect('/admin/permissions')
      }
    } catch (error) {
      request.yar.flash(sessionNames.globalValidationFailures, error.message)

      return h.redirect(`/admin/permissions/${scopeId}/confirm-delete`)
    }
  }
}

export { deletePermissionController }
