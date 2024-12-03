import Joi from 'joi'
import Boom from '@hapi/boom'

import { formatText } from '~/src/config/nunjucks/filters/index.js'
import { fetchScope } from '~/src/server/admin/permissions/helpers/fetchers.js'

const confirmRemovePermissionController = {
  options: {
    validate: {
      params: Joi.object({
        teamId: Joi.string().guid().required(),
        scopeId: Joi.objectId().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const { scope } = await fetchScope(request, request.params.scopeId)
    const team = scope.teams.find(
      (team) => team.teamId === request.params.teamId
    )
    const formattedValue = formatText(scope.value)
    const title = 'Remove'

    return h.view('admin/permissions/views/remove/confirm-remove-permission', {
      pageTitle: 'Remove Permission from Team',
      scope,
      team,
      pageHeading: {
        text: `${formattedValue} from ${team.name} Team`
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
    })
  }
}

export { confirmRemovePermissionController }
