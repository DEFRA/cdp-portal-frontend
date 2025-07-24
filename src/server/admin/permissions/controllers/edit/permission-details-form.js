import Boom from '@hapi/boom'

import Joi from '../../../../common/helpers/extended-joi.js'
import { fetchPermissionsScope } from '../../helpers/fetchers.js'
import { buildOptions } from '../../../../common/helpers/options/build-options.js'

const editPermissionDetailsFormController = {
  options: {
    validate: {
      params: Joi.object({
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
    const kindOptions = buildOptions(
      [
        { text: 'User', value: 'user' },
        { text: 'Team', value: 'team' }
      ],
      false
    )

    return h.view('admin/permissions/views/edit/permission-details-form', {
      pageTitle: 'Edit permission',
      scope,
      kindOptions,
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
          text: 'Edit'
        }
      ]
    })
  }
}

export { editPermissionDetailsFormController }
