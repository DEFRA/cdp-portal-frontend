import Boom from '@hapi/boom'
import { teamIdValidation, userIdValidation } from '@defra/cdp-validation-kit'

import Joi from '../../../../../common/helpers/extended-joi.js'
import { sessionNames } from '../../../../../common/constants/session-names.js'
import { removeScopeFromUser } from '../../../helpers/fetchers.js'

const removePermissionFromUserController = {
  options: {
    validate: {
      params: Joi.object({
        userId: userIdValidation,
        scopeId: Joi.objectId().required()
      }),
      payload: Joi.object({
        teamId: teamIdValidation.optional()
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const params = request.params
    const userId = params.userId
    const scopeId = params.scopeId

    try {
      await removeScopeFromUser({
        request,
        userId,
        scopeId
      })
    } catch (error) {
      request.yar.flash(sessionNames.globalValidationFailures, error.message)
    }

    return h.redirect('/admin/permissions/' + scopeId)
  }
}

export { removePermissionFromUserController }
