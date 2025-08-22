import Boom from '@hapi/boom'
import Joi from '../../../common/helpers/extended-joi.js'

import { fetchPermission } from '../helpers/fetchers.js'
import { transformScopeToSummary } from '../transformers/scope-to-summary.js'
import { transformScopeTeamsToTaskList } from '../transformers/scope-teams-to-task-list.js'
import { transformScopeUsersToRows } from '../transformers/scope-users-to-rows.js'

const permissionController = {
  options: {
    validate: {
      params: Joi.object({
        scopeId: Joi.objectId().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const { scope } = await fetchPermission(request, request.params.scopeId)

    return h.view('admin/permissions/views/permission', {
      pageTitle: scope.value,
      heading: scope.value,
      summaryList: transformScopeToSummary(scope),
      usersWithPermissionRows: transformScopeUsersToRows(scope),
      teamsTaskList: transformScopeTeamsToTaskList(scope),
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
          text: scope.value
        }
      ]
    })
  }
}

export { permissionController }
