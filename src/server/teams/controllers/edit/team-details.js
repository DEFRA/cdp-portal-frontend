import Joi from 'joi'
import Boom from '@hapi/boom'

import { sessionNames } from '~/src/server/common/constants/session-names.js'
import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details.js'
import { teamValidation } from '~/src/server/teams/helpers/schema/team-validation.js'
import { noSessionRedirect } from '~/src/server/teams/helpers/ext/no-session-redirect.js'
import { editTeam } from '~/src/server/admin/teams/helpers/fetch/index.js'
import { provideCdpTeam } from '~/src/server/admin/teams/helpers/pre/provide-cdp-team.js'

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

      const { data, response } = await editTeam(request, cdpTeam.teamId, {
        name: cdpTeam.name,
        description: sanitisedPayload.description,
        github: cdpTeam.github,
        ...(cdpTeam.serviceCode && { serviceCodes: [cdpTeam.serviceCode] })
      })

      if (response?.ok) {
        request.yar.clear(sessionNames.cdpTeam)
        request.yar.clear(sessionNames.validationFailure)
        await request.yar.commit(h)

        request.yar.flash(sessionNames.notifications, {
          text: 'Team updated',
          type: 'success'
        })

        return h.redirect(`/teams/${teamId}`)
      }

      request.yar.flash(sessionNames.globalValidationFailures, data.message)

      return h.redirect(`/teams/${teamId}/team-details`)
    }
  }
}

export { teamDetailsController }
