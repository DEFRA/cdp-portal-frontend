import Boom from '@hapi/boom'
import { userIdValidation } from '@defra/cdp-validation-kit'

import Joi from '../../../../../common/helpers/extended-joi.js'
import { addScopeToMember } from '../../../helpers/fetchers.js'
import { sessionNames } from '../../../../../common/constants/session-names.js'
import { userPermissionValidation } from '../../../helpers/schema/user-permission-validation.js'
import { provideStepData } from '../../../../../common/helpers/multistep-form/provide-step-data.js'

const addPermissionToMemberController = {
  options: {
    id: 'admin/permissions/{scopeId}/user/{userId}/add/{multiStepFormId}',
    validate: {
      params: Joi.object({
        scopeId: Joi.objectId().required(),
        userId: userIdValidation,
        multiStepFormId: Joi.string().uuid().required()
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    },
    pre: [provideStepData]
  },
  handler: async (request, h) => {
    const userSession = await request.getUserSession()

    const params = request.params
    const scopeId = params.scopeId
    const userId = params.userId
    const multiStepFormId = params.multiStepFormId

    const stepData = request.pre?.stepData
    const teamId = stepData.teamId

    const validationResult = userPermissionValidation.validate(
      {
        userId,
        scopeId,
        teamId
      },
      { abortEarly: false }
    )

    const returnToSummaryRoute = request.routeLookup(
      'admin/permissions/{scopeId}/user/{userId}/summary/{multiStepFormId}',
      { params: { scopeId, userId, multiStepFormId } }
    )

    if (validationResult?.error) {
      request.yar.flash(
        sessionNames.globalValidationFailures,
        'Something is not quite right! Check the summary is correct and try again'
      )

      return h.redirect(returnToSummaryRoute)
    }

    if (!validationResult.error) {
      try {
        await addScopeToMember({
          request,
          userId,
          scopeId,
          teamId
        })
      } catch (error) {
        const message = error?.data?.payload?.message ?? error.message
        request.yar.flash(sessionNames.globalValidationFailures, message)
        request.logger.error(error, message)

        return h.redirect(returnToSummaryRoute)
      }

      request.yar.flash(sessionNames.notifications, {
        text: 'Permission added successfully',
        type: 'success'
      })

      request.audit.sendMessage({
        event: `permission: ${scopeId} added to user: ${userId} by ${userSession.id}:${userSession.email}`,
        data: {
          userId,
          scopeId
        },
        user: userSession
      })

      return h.redirect(`/admin/permissions/${scopeId}`)
    }
  }
}

export { addPermissionToMemberController }
