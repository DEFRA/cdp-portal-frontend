import Joi from 'joi'
import { editTeam } from '#server/admin/teams/helpers/fetch/fetchers.js'
import { sessionNames } from '#server/common/constants/session-names.js'
import Boom from '@hapi/boom'
import { teamIdValidation } from '@defra/cdp-validation-kit'
import { removeNil } from '#server/common/helpers/remove-nil.js'

const editTeamController = {
  options: {
    validate: {
      params: Joi.object({
        teamId: teamIdValidation
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const teamId = request.params.teamId
    const payload = request.payload

    const name = payload.name
    const description = payload.description || undefined
    const deliveryGroupId = payload.deliveryGroupId || undefined
    const serviceCodes = [payload.serviceCode] || undefined
    const github = payload.github || undefined
    const alertEmailAddresses = payload.alertEmailAddresses
      ? payload.alertEmailAddresses.split(/\s*,\s*/)
      : undefined
    const alertEnvironments = Array.isArray(payload.alertEnvironments)
      ? payload.alertEnvironments
      : [payload.alertEnvironments].filter(Boolean)

    const sanitisedPayload = {
      ...removeNil({
        name,
        description,
        serviceCodes,
        deliveryGroupId,
        alertEmailAddresses,
        alertEnvironments,
        github
      })
    }

    try {
      await editTeam(request, teamId, sanitisedPayload)

      request.yar.flash(sessionNames.notifications, {
        text: 'Team updated',
        type: 'success'
      })
      return h.redirect(`/admin/teams/${teamId}`)
    } catch (error) {
      request.logger.error(error.message)
      request.yar.flash(sessionNames.globalValidationFailures, error.message)

      return h.redirect(`/admin/teams/${teamId}/edit`)
    }
  }
}

export { editTeamController }
