import Joi from 'joi'
import Boom from '@hapi/boom'

import { sessionNames } from '~/src/server/common/constants/session-names'
import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details'
import { provideCdpTeam } from '~/src/server/admin/teams/helpers'
import { teamValidation } from '~/src/server/teams/helpers/schema/team-validation'
import { noSessionRedirect } from '~/src/server/teams/helpers/ext/no-session-redirect'
import { editTeam } from '~/src/server/admin/teams/helpers/fetch'

const teamDetailsController = {
  options: {
    validate: {
      params: Joi.object({
        teamId: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    },
    ext: {
      onPreHandler: [noSessionRedirect]
    },
    pre: [provideCdpTeam]
  },
  handler: async (request, h) => {
    const teamId = request.params.teamId
    const payload = request?.payload
    const description = payload?.description || null

    const sanitisedPayload = {
      description
    }

    const validationResult = teamValidation.validate(sanitisedPayload, {
      abortEarly: false
    })

    if (validationResult?.error) {
      const errorDetails = buildErrorDetails(validationResult.error.details)

      request.yar.flash(sessionNames.validationFailure, {
        formValues: sanitisedPayload,
        formErrors: errorDetails
      })

      return h.redirect(`/teams/${teamId}/team-details`)
    }

    if (!validationResult.error) {
      const cdpTeam = request.pre?.cdpTeam

      const response = await editTeam(request, cdpTeam.teamId, {
        name: cdpTeam.name,
        description: sanitisedPayload.description,
        github: cdpTeam.github,
        ...(cdpTeam.serviceCode && { serviceCodes: [cdpTeam.serviceCode] })
      })
      const json = await response.json()

      if (response.ok) {
        request.yar.clear(sessionNames.cdpTeam)
        request.yar.clear(sessionNames.validationFailure)
        await request.yar.commit(h)

        request.yar.flash(sessionNames.notifications, {
          text: 'Team updated',
          type: 'success'
        })

        return h.redirect(`/teams/${teamId}`)
      }

      request.yar.flash(sessionNames.globalValidationFailures, json.message)

      return h.redirect(`/teams/${teamId}/team-details`)
    }
  }
}

export { teamDetailsController }
