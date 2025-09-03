import Joi from 'joi'
import Boom from '@hapi/boom'
import { teamIdValidation, scopes } from '@defra/cdp-validation-kit'

import { sessionNames } from '../../../common/constants/session-names.js'
import { buildErrorDetails } from '../../../common/helpers/build-error-details.js'
import { teamValidation } from '../../helpers/schema/team-validation.js'
import {
  editTeam,
  fetchCdpTeam
} from '../../../admin/teams/helpers/fetch/index.js'

const teamDetailsController = {
  options: {
    auth: {
      mode: 'required',
      access: {
        scope: [scopes.admin, 'team:{params.teamId}']
      }
    },
    validate: {
      params: Joi.object({
        teamId: teamIdValidation
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
      const team = await fetchCdpTeam(teamId)

      try {
        await editTeam(request, teamId, {
          ...team,
          description
        })

        request.yar.clear(sessionNames.validationFailure)
        request.yar.flash(sessionNames.notifications, {
          text: 'Team updated',
          type: 'success'
        })

        return h.redirect(`/teams/${teamId}`)
      } catch (error) {
        request.yar.flash(sessionNames.globalValidationFailures, error.message)

        return h.redirect(`/teams/${teamId}/edit`)
      }
    }
  }
}

export { teamDetailsController }
