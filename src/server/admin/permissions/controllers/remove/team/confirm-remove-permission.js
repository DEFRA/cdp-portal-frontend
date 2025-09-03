import Joi from 'joi'
import Boom from '@hapi/boom'
import { teamIdValidation } from '@defra/cdp-validation-kit'

import { fetchPermission } from '../../../helpers/fetchers.js'

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
    const scope = await fetchPermission(request, request.params.scopeId)
    const team = scope.teams.find((t) => t.teamId === request.params.teamId)

    if (!team) {
      return Boom.notFound()
    }

    const title = 'Remove'

    return h.view(
      'admin/permissions/views/remove/team/confirm-remove-permission',
      {
        pageTitle: 'Remove Permission from Team',
        scope,
        team,
        pageHeading: {
          text: `${scope.value} from ${team.name} Team`
        },
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
            text: title
          }
        ]
      }
    )
  }
}

export { confirmRemovePermissionFromTeamController }
