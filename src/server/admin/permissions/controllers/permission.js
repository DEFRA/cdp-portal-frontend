import Boom from '@hapi/boom'

import Joi from '~/src/server/common/helpers/extended-joi.js'
import { formatText } from '~/src/config/nunjucks/filters/index.js'
import { fetchScope } from '~/src/server/admin/permissions/helpers/fetchers.js'
import { transformScopeToSummary } from '~/src/server/admin/permissions/transformers/scope-to-summary.js'
import { transformScopeTeamsToTaskList } from '~/src/server/admin/permissions/transformers/scope-teams-to-task-list.js'

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
    const { scope } = await fetchScope(request, request.params.scopeId)
    const formattedValue = formatText(scope.value)

    return h.view('admin/permissions/views/permission', {
      pageTitle: formattedValue,
      heading: formattedValue,
      summaryList: transformScopeToSummary(scope),
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
