import Joi from 'joi'
import Boom from '@hapi/boom'
import {
  teamIdValidation,
  userIdValidation,
  scopes
} from '@defra/cdp-validation-kit'

import { buildErrorDetails } from '../../../common/helpers/build-error-details.js'
import { sessionNames } from '../../../common/constants/session-names.js'
import { breakGlassValidation } from '../../helpers/schema/break-glass-validation.js'
import { addBreakGlassToMember } from '../../../admin/permissions/helpers/fetchers.js'
import { fetchCdpUser } from '../../../admin/users/helpers/fetch/index.js'

const grantBreakGlassController = {
  options: {
    id: 'post:teams/{teamId}/grant-break-glass/{userId}',
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
      payload: Joi.object({
        reason: Joi.string().allow('').required(),
        complianceRequirements: Joi.string().valid('yes', 'no').required(),
        iAgree: Joi.string().valid('yes').optional()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const params = request.params
    const teamId = params.teamId
    const userId = params.userId

    const payload = request.payload
    const complianceRequirements = payload.complianceRequirements
    const hasReadTsAndCs = complianceRequirements === 'yes'
    const reason = payload.reason
    const iAgree = payload.iAgree

    const validationResult = breakGlassValidation(hasReadTsAndCs).validate(
      { reason, iAgree, complianceRequirements },
      {
        abortEarly: false
      }
    )

    const sanitisedPayload = {
      reason,
      iAgree,
      complianceRequirements
    }

    const returnToForm = request.routeLookup(
      'teams/{teamId}/grant-break-glass/{userId}',
      {
        params: { teamId, userId }
      }
    )

    if (validationResult?.error) {
      const errorDetails = buildErrorDetails(validationResult.error.details)

      request.yar.flash(sessionNames.validationFailure, {
        formValues: sanitisedPayload,
        formErrors: errorDetails
      })

      return h.redirect(returnToForm)
    }

    if (!validationResult.error) {
      try {
        const [user] = await Promise.all([
          fetchCdpUser(userId),
          addBreakGlassToMember({ request, userId, teamId })
        ])

        request.yar.clear(sessionNames.validationFailure)
        request.yar.flash(sessionNames.notifications, {
          text: `Break glass permission added for ${user.name}`,
          type: 'success'
        })

        return h.redirect(
          request.routeLookup('teams/{teamId}', { params: { teamId } })
        )
      } catch (error) {
        const message = error?.data?.payload?.message ?? error.message
        request.yar.flash(sessionNames.globalValidationFailures, message)

        return h.redirect(returnToForm)
      }
    }
  }
}

export { grantBreakGlassController }
