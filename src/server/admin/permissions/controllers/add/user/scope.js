import Boom from '@hapi/boom'

import Joi from '../../../../../common/helpers/extended-joi.js'
import { sessionNames } from '../../../../../common/constants/session-names.js'
import { buildErrorDetails } from '../../../../../common/helpers/build-error-details.js'
import { userScopeValidation } from '../../../helpers/schema/user-permission-validation.js'

const scopeController = {
  options: {
    id: 'post:admin/permissions/{scopeId}/user/{userId}/scope/{multiStepFormId}',
    validate: {
      params: Joi.object({
        scopeId: Joi.objectId().required(),
        userId: Joi.string().uuid().required(),
        multiStepFormId: Joi.string().uuid().required()
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const params = request.params
    const scopeId = params.scopeId
    const userId = params.userId

    const payload = request?.payload
    const scopeKind = payload.scopeKind
    const scopeToTeam = scopeKind === 'team'
    const teamId = payload?.teamId
    const redirectLocation = payload?.redirectLocation

    const multiStepFormId = request.app.multiStepFormId

    const validationResult = userScopeValidation(scopeToTeam).validate(
      payload,
      { abortEarly: false }
    )
    const sanitisedPayload = {
      scopeKind,
      teamId: scopeToTeam ? teamId : null
    }

    const query = {
      ...(redirectLocation && { redirectLocation })
    }
    const returnToFormRedirectRoute = request.routeLookup(
      'admin/permissions/{scopeId}/user/{userId}/scope/{multiStepFormId}',
      {
        params: { scopeId, userId, multiStepFormId },
        query
      }
    )

    if (validationResult?.error) {
      const errorDetails = buildErrorDetails(validationResult.error.details)

      request.yar.flash(sessionNames.validationFailure, {
        formValues: sanitisedPayload,
        formErrors: errorDetails
      })

      return h.redirect(returnToFormRedirectRoute)
    }

    if (!validationResult.error) {
      await request.app.saveStepData(multiStepFormId, sanitisedPayload, h)

      const summaryRoute = request.routeLookup(
        'admin/permissions/{scopeId}/user/{userId}/summary/{multiStepFormId}',
        { params: { scopeId, userId, multiStepFormId } }
      )

      return h.redirect(summaryRoute)
    }
  }
}

export { scopeController }
