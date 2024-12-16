import Joi from 'joi'
import Boom from '@hapi/boom'

import { sessionNames } from '~/src/server/common/constants/session-names.js'
import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details.js'
import { teamValidation } from '~/src/server/teams/helpers/schema/team-validation.js'
import {
  editTeam,
  fetchCdpTeam
} from '~/src/server/admin/teams/helpers/fetch/index.js'

const teamDetailsController = {
  options: {
    validate: {
      params: Joi.object({
        teamId: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
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

      return h.redirect(`/teams/${teamId}/edit`)
    }

    if (!validationResult.error) {
      const { team } = await fetchCdpTeam(teamId)

      const { data, response } = await editTeam(request, teamId, {
        ...team,
        description
      })

      if (response?.ok) {
        request.yar.clear(sessionNames.validationFailure)
        request.yar.flash(sessionNames.notifications, {
          text: 'Team updated',
          type: 'success'
        })

        return h.redirect(`/teams/${teamId}`)
      }

      request.yar.flash(sessionNames.globalValidationFailures, data.message)

      return h.redirect(`/teams/${teamId}/edit`)
    }
  }
}

export { teamDetailsController }
