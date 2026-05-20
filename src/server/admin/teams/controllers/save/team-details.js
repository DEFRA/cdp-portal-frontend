import qs from 'qs'

import { sessionNames } from '../../../../common/constants/session-names.js'
import { buildErrorDetails } from '../../../../common/helpers/build-error-details.js'
import { teamValidation } from '../../helpers/schema/team-validation.js'
import { getEnvironments } from '../../../../common/helpers/environments/get-environments.js'
import Joi from 'joi'

const teamDetailsController = {
  options: {
    validate: {
      params: Joi.object({
        multiStepFormId: Joi.string().uuid().optional()
      })
    }
  },
  handler: async (request, h) => {
    const payload = request?.payload
    const multiStepFormId = request.app.multiStepFormId
    const redirectLocation = payload?.redirectLocation

    const name = payload.name
    const description = payload.description || undefined
    const serviceCode = payload.serviceCode || undefined
    const alertEmailAddresses = payload.alertEmailAddresses
      ? payload.alertEmailAddresses.split(/\s*,\s*/)
      : undefined
    const environments = getEnvironments(request.auth.credentials?.scope)
    const alertEnvironments = Array.isArray(payload.alertEnvironments)
      ? payload.alertEnvironments
      : [payload.alertEnvironments].filter(Boolean)

    const sanitisedPayload = {
      name,
      description,
      serviceCode,
      alertEmailAddresses,
      alertEnvironments
    }

    const validationResult = teamValidation(environments).validate(
      sanitisedPayload,
      {
        abortEarly: false
      }
    )

    if (validationResult?.error) {
      const errorDetails = buildErrorDetails(validationResult.error.details)

      request.yar.flash(sessionNames.validationFailure, {
        formValues: sanitisedPayload,
        formErrors: errorDetails
      })

      const queryString = qs.stringify(
        {
          ...(redirectLocation && { redirectLocation })
        },
        {
          addQueryPrefix: true
        }
      )

      return h.redirect(
        `/admin/teams/team-details/${multiStepFormId}${queryString}`
      )
    }

    if (!validationResult.error) {
      const cdpTeam = await request.app.saveStepData(
        multiStepFormId,
        {
          ...sanitisedPayload
        },
        h
      )

      const queryString = qs.stringify(
        {
          ...(cdpTeam?.github && { githubSearch: cdpTeam?.github ?? '' })
        },
        { addQueryPrefix: true }
      )

      const redirectTo = redirectLocation
        ? `/admin/teams/${redirectLocation}/${multiStepFormId}`
        : `/admin/teams/find-github-team/${multiStepFormId}${queryString}`

      return h.redirect(redirectTo)
    }
  }
}

export { teamDetailsController }
