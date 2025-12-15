import Joi from 'joi'
import Boom from '@hapi/boom'
import { teamIdValidation, userIdValidation } from '@defra/cdp-validation-kit'

import { fetchPermission } from '../../../helpers/fetchers.js'
import { fetchCdpTeam } from '../../../../teams/helpers/fetch/fetchers.js'

const confirmRemovePermissionFromMemberController = {
  options: {
    validate: {
      params: Joi.object({
        userId: userIdValidation,
        scopeId: Joi.string().required(),
        teamId: teamIdValidation
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const params = request.params
    const title = 'Remove'

    const scope = await fetchPermission(request, params.scopeId)
    const matchedMember = scope.members.find(
      (member) =>
        member.userId === params.userId && member.teamId === params.teamId
    )
    const { team } = await fetchCdpTeam(params.teamId)

    return h.view(
      'admin/permissions/views/remove/member/confirm-remove-permission',
      {
        pageTitle: 'Remove Permission from Member',
        scope,
        matchedMember,
        team,
        pageHeading: {
          text: `${scope.value} from user ${matchedMember?.userName}`
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

export { confirmRemovePermissionFromMemberController }
