import Boom from '@hapi/boom'

import Joi from '../../../common/helpers/extended-joi.js'
import { formatText } from '../../../../config/nunjucks/filters/filters.js'
import { fetchPermissionsScope } from '../helpers/fetchers.js'
import { transformScopeToSummary } from '../transformers/scope-to-summary.js'
import { transformScopeTeamsToTaskList } from '../transformers/scope-teams-to-task-list.js'
import { transformScopeUsersToTaskList } from '../transformers/scope-users-to-task-list.js'

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
    const scope = await fetchPermissionsScope(request, request.params.scopeId)
    const formattedValue = formatText(scope.value)

    return h.view('admin/permissions/views/permission', {
      pageTitle: formattedValue,
      heading: formattedValue,
      summaryList: transformScopeToSummary(scope),
      usersTaskList: transformScopeUsersToTaskList(scope),
      teamsTaskList: transformScopeTeamsToTaskList(scope),
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
          text: formattedValue
        }
      ]
    })
  }
}

export { permissionController }
