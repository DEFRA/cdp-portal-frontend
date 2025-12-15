import Boom from '@hapi/boom'

import Joi from 'joi'
import { sessionNames } from '../../../../../common/constants/session-names.js'
import { buildErrorDetails } from '../../../../../common/helpers/build-error-details.js'
import { userFindValidation } from '../../../helpers/schema/user-permission-validation.js'

const findUserController = {
  options: {
    id: 'post:admin/permissions/{scopeId}/user/find/{multiStepFormId?}',
    validate: {
      params: Joi.object({
        scopeId: Joi.string().required(),
        multiStepFormId: Joi.string().uuid().optional()
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const params = request.params
    const scopeId = params.scopeId

    const payload = request?.payload
    const button = payload?.button
    const redirectLocation = payload?.redirectLocation
    const multiStepFormId = request.app.multiStepFormId
    const isSearch = payload.button === 'search'

    const searchQuery = payload?.searchQuery || null
    const userId = payload.userId

    const validationResult = userFindValidation(userId, button).validate(
      payload,
      {
        abortEarly: false
      }
    )

    const sanitisedPayload = {
      searchQuery,
      userId
    }

    const query = {
      ...(redirectLocation && { redirectLocation }),
      ...(searchQuery && { searchQuery }),
      ...(userId && { userId })
    }
    const returnToFormRedirect = request.routeLookup(
      'admin/permissions/{scopeId}/user/find/{multiStepFormId?}',
      {
        params: { scopeId, multiStepFormId },
        query
      }
    )

    if (validationResult?.error) {
      const errorDetails = buildErrorDetails(validationResult.error.details)

      request.yar.flash(sessionNames.validationFailure, {
        formValues: sanitisedPayload,
        formErrors: errorDetails
      })

      return h.redirect(returnToFormRedirect)
    }

    // Fallback server side search
    if (!validationResult.error && isSearch) {
      request.yar.flash(sessionNames.validationFailure, {
        formValues: sanitisedPayload
      })

      return h.redirect(returnToFormRedirect)
    }

    if (!validationResult.error) {
      await request.app.saveStepData(multiStepFormId, sanitisedPayload, h)

      const summaryRoute = request.routeLookup(
        'admin/permissions/{scopeId}/user/{userId}/summary/{multiStepFormId}',
        { params: { scopeId, userId, multiStepFormId } }
      )
      const nextStepRoute = request.routeLookup(
        'admin/permissions/{scopeId}/user/{userId}/team-scope/{multiStepFormId}',
        { params: { scopeId, userId, multiStepFormId } }
      )

      const redirectTo = redirectLocation ? summaryRoute : nextStepRoute
      return h.redirect(redirectTo)
    }
  }
}

export { findUserController }
