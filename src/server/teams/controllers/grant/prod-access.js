import Joi from 'joi'
import Boom from '@hapi/boom'
import { teamIdValidation, userIdValidation } from '@defra/cdp-validation-kit'
import { scopes } from '@defra/cdp-validation-kit/src/constants/scopes.js'

import { buildErrorDetails } from '../../../common/helpers/build-error-details.js'
import { sessionNames } from '../../../common/constants/session-names.js'
import { prodAccessValidation } from '../../helpers/schema/prod-access-validation.js'
import { addProdAccessToMember } from '../../../admin/permissions/helpers/fetchers.js'
import { fetchCdpUser } from '../../../admin/users/helpers/fetch/index.js'

const grantProdAccessController = {
  options: {
    id: 'post:teams/{teamId}/grant-prod-access/{userId}',
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

    const validationResult = prodAccessValidation(hasReadTsAndCs).validate(
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
      'teams/{teamId}/grant-prod-access/{userId}',
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
        const [{ user }] = await Promise.all([
          fetchCdpUser(userId),
          addProdAccessToMember({ request, userId, teamId })
        ])

        request.yar.clear(sessionNames.validationFailure)
        request.yar.flash(sessionNames.notifications, {
          text: `Prod access permission added for ${user.name}`,
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

export { grantProdAccessController }
