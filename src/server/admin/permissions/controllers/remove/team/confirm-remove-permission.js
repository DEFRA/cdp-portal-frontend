import Joi from 'joi'
import Boom from '@hapi/boom'

import { formatText } from '~/src/config/nunjucks/filters/filters.js'
import { fetchPermissionsScope } from '~/src/server/admin/permissions/helpers/fetchers.js'
import { teamIdValidation } from '@defra/cdp-validation-kit/src/validations.js'

const confirmRemovePermissionFromTeamController = {
  options: {
    validate: {
      params: Joi.object({
        teamId: teamIdValidation,
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
    const team = scope.teams.find((t) => t.teamId === request.params.teamId)

    if (!team) {
      return Boom.notFound()
    }

    const formattedValue = formatText(scope.value)
    const title = 'Remove'

    return h.view(
      'admin/permissions/views/remove/team/confirm-remove-permission',
      {
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
      }
    )
  }
}

export { confirmRemovePermissionFromTeamController }
