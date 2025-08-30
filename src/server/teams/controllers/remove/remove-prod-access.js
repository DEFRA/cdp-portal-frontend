import Joi from 'joi'
import Boom from '@hapi/boom'
import { scopes } from '@defra/cdp-validation-kit/src/constants/scopes.js'
import { teamIdValidation, userIdValidation } from '@defra/cdp-validation-kit'

import { sessionNames } from '../../../common/constants/session-names.js'
import { removeProdAccessFromMember } from '../../../admin/permissions/helpers/fetchers.js'
import { fetchCdpUser } from '../../../admin/users/helpers/fetch/index.js'

const removeProdAccessController = {
  options: {
    id: 'post:teams/{teamId}/remove-prod-access/{userId}',
    auth: {
      mode: 'required',
      access: {
        scope: [
          scopes.canGrantProdAccess,
          `${scopes.canGrantProdAccess}:team:{params.teamId}`
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
    const userSession = await request.getUserSession()
    const params = request.params
    const teamId = params.teamId
    const userId = params.userId

    try {
      const [{ user }] = await Promise.all([
        fetchCdpUser(userId),
        removeProdAccessFromMember({ request, userId, teamId })
      ])

      request.audit.sendMessage({
        event: `permission: prodAccess removed from member: ${userId} in team: ${teamId} by ${userSession.id}:${userSession.email}`,
        data: { userId, scopeId: 'prodAccess' },
        user: userSession
      })

      request.yar.flash(sessionNames.notifications, {
        text: `Prod access permission removed from ${user.name}`,
        type: 'success'
      })

      return h.redirect(
        request.routeLookup('teams/{teamId}', { params: { teamId } })
      )
    } catch (error) {
      const message = error?.data?.payload?.message ?? error.message
      request.yar.flash(sessionNames.globalValidationFailures, message)

      return h.redirect(
        request.routeLookup('teams/{teamId}/remove-prod-access/{userId}', {
          params: { teamId, userId }
        })
      )
    }
  }
}

export { removeProdAccessController }
