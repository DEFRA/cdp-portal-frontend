import Joi from 'joi'
import Boom from '@hapi/boom'
import {
  scopes,
  teamIdValidation,
  userIdValidation
} from '@defra/cdp-validation-kit'

import { sessionNames } from '../../../common/constants/session-names.js'
import { removeBreakGlassFromMember } from '../../../admin/permissions/helpers/fetchers.js'
import { fetchCdpUser } from '../../../admin/users/helpers/fetch/fetchers.js'

const removeBreakGlassController = {
  options: {
    id: 'post:teams/{teamId}/remove-break-glass/{userId}',
    auth: {
      mode: 'required',
      access: {
        scope: [
          scopes.canGrantBreakGlass,
          `${scopes.canGrantBreakGlass}:team:{params.teamId}`
        ]
      }
    },
    validate: {
      params: Joi.object({
        teamId: teamIdValidation,
        userId: userIdValidation
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const params = request.params
    const teamId = params.teamId
    const userId = params.userId

    try {
      const [user] = await Promise.all([
        fetchCdpUser(userId),
        removeBreakGlassFromMember({ request, userId, teamId })
      ])

      request.audit.sendMessage({
        event: `permission: breakGlass removed from member: ${userId} in team: ${teamId}`,
        data: { userId, scopeId: 'breakGlass' }
      })

      request.yar.flash(sessionNames.notifications, {
        text: `Break glass permission removed from ${user.name}`,
        type: 'success'
      })

      return h.redirect(
        request.routeLookup('teams/{teamId}', { params: { teamId } })
      )
    } catch (error) {
      const message = error?.data?.payload?.message ?? error.message
      request.yar.flash(sessionNames.globalValidationFailures, message)

      return h.redirect(
        request.routeLookup('teams/{teamId}/remove-break-glass/{userId}', {
          params: { teamId, userId }
        })
      )
    }
  }
}

export { removeBreakGlassController }
