import Joi from 'joi'
import Boom from '@hapi/boom'

import { fetchCdpTeam } from '../../helpers/fetch/fetchers.js'
import { fetchCdpUser } from '../../../users/helpers/fetch/fetchers.js'
import { teamIdValidation, userIdValidation } from '@defra/cdp-validation-kit'

const confirmRemoveMemberController = {
  options: {
    validate: {
      params: Joi.object({
        teamId: teamIdValidation,
        userId: userIdValidation
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const team = await fetchCdpTeam(request.params.teamId)
    const user = await fetchCdpUser(request.params.userId)
    const title = 'Remove'

    return h.view('admin/teams/views/remove/confirm-remove-member', {
      pageTitle: 'Remove Team Member',
      team,
      user,
      splitPaneBreadcrumbs: [
        {
          text: 'Admin',
          href: '/admin'
        },
        {
          text: 'Teams',
          href: '/admin/teams'
        },
        {
          text: team.name,
          href: `/admin/teams/${team.teamId}`
        },
        {
          text: title
        }
      ]
    })
  }
}

export { confirmRemoveMemberController }
