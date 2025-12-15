import Joi from 'joi'
import Boom from '@hapi/boom'

import { fetchPermission } from '../../helpers/fetchers.js'
import { transformScopeToSummary } from '../../transformers/scope-to-summary.js'
import { transformScopeTeamsToTaskList } from '../../transformers/scope-teams-to-task-list.js'

const confirmDeletePermissionController = {
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

    return h.view('admin/permissions/views/delete/confirm-delete-permission', {
      pageTitle: 'Confirm Permission Deletion',
      summaryList: transformScopeToSummary(scope, false),
      teamsTaskList: transformScopeTeamsToTaskList(scope, false),
      scope,
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
          text: 'Delete'
        }
      ]
    })
  }
}

export { confirmDeletePermissionController }
