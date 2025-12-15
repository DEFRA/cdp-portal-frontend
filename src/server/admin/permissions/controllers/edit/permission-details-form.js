import Boom from '@hapi/boom'

import Joi from 'joi'
import { fetchPermission } from '../../helpers/fetchers.js'
import { kindOptions } from '../../helpers/build-kind-options.js'

const editPermissionDetailsFormController = {
  options: {
    validate: {
      params: Joi.object({
        scopeId: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const scope = await fetchPermission(request, request.params.scopeId)

    return h.view('admin/permissions/views/edit/permission-details-form', {
      pageTitle: 'Edit permission',
      scope,
      kindOptions,
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
          text: 'Edit'
        }
      ]
    })
  }
}

export { editPermissionDetailsFormController }
