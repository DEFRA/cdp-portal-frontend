import Joi from 'joi'
import Boom from '@hapi/boom'

import { formatText } from '~/src/config/nunjucks/filters/filters.js'
import { fetchPermissionsScope } from '~/src/server/admin/permissions/helpers/fetchers.js'
import { transformScopeToSummary } from '~/src/server/admin/permissions/transformers/scope-to-summary.js'
import { transformScopeTeamsToTaskList } from '~/src/server/admin/permissions/transformers/scope-teams-to-task-list.js'

const confirmDeletePermissionController = {
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
    const formattedValue = formatText(scope.value)

    return h.view('admin/permissions/views/delete/confirm-delete-permission', {
      pageTitle: 'Confirm Permission Deletion',
      summaryList: transformScopeToSummary(scope, false),
      teamsTaskList: transformScopeTeamsToTaskList(scope, false),
      scope,
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
          text: 'Delete'
        }
      ]
    })
  }
}

export { confirmDeletePermissionController }
