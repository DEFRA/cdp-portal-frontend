import Joi from 'joi'
import Boom from '@hapi/boom'
import { userIdValidation } from '@defra/cdp-validation-kit'

import { fetchPermission } from '../../../helpers/fetchers.js'

const confirmRemovePermissionFromUserController = {
  options: {
    validate: {
      params: Joi.object({
        userId: userIdValidation,
        scopeId: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const scope = await fetchPermission(request, request.params.scopeId)
    const user = scope.users.find((u) => u.userId === request.params.userId)

    const title = 'Remove'

    return h.view(
      'admin/permissions/views/remove/user/confirm-remove-permission',
      {
        pageTitle: 'Remove Permission from User',
        scope,
        user,
        pageHeading: {
          text: `${scope.value} from user ${user.userName}`
        },
        splitPaneBreadcrumbs: [
          {
            text: 'Admin',
            href: '/admin'
          },
          {
            text: 'Permissions',
            href: '/admin/permissions'
          },
          {
            text: scope.value,
            href: `/admin/permissions/${scope.scopeId}`
          },
          {
            text: title
          }
        ]
      }
    )
  }
}

export { confirmRemovePermissionFromUserController }
