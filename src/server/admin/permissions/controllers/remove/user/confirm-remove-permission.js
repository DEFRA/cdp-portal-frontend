import Joi from 'joi'
import Boom from '@hapi/boom'

import { formatText } from '../../../../../../config/nunjucks/filters/filters.js'
import { fetchPermissionsScope } from '../../../helpers/fetchers.js'
import { userIdValidation } from '@defra/cdp-validation-kit/src/validations.js'

const confirmRemovePermissionFromUserController = {
  options: {
    validate: {
      params: Joi.object({
        userId: userIdValidation,
        scopeId: Joi.objectId().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const { scope } = await fetchPermissionsScope(
      request,
      request.params.scopeId
    )
    const user = scope.users.find((u) => u.userId === request.params.userId)
    const formattedValue = formatText(scope.value)
    const title = 'Remove'

    return h.view(
      'admin/permissions/views/remove/user/confirm-remove-permission',
      {
        pageTitle: 'Remove Permission from User',
        scope,
        user,
        pageHeading: {
          text: `${formattedValue} from user ${user.name}`
        },
        breadcrumbs: [
          {
            text: 'Admin',
            href: '/admin'
          },
          {
            text: 'Permissions',
            href: '/admin/permissions'
          },
          {
            text: formattedValue,
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
