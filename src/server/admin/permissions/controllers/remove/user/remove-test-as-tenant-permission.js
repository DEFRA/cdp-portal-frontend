import { scopes } from '@defra/cdp-validation-kit'
import { sessionNames } from '../../../../../common/constants/session-names.js'
import {
  fetchPermissionByName,
  removeScopeFromUser
} from '../../../helpers/fetchers.js'

const removeTestAsTenantScopeController = {
  options: {
    id: 'admin/removeTestAsTenant'
  },
  handler: async (request, h) => {
    const userSession = await request.getUserSession()

    try {
      const scope = await fetchPermissionByName(
        request,
        scopes.testAsTenant.replace('permission:', '')
      )
      const scopeId = scope.scopeId
      const userId = userSession.id

      await removeScopeFromUser({
        request,
        userId,
        scopeId
      })

      request.yar.flash(sessionNames.notifications, {
        text: 'Test as tenant permission removed from user',
        type: 'success'
      })

      request.audit.sendMessage({
        event: `permission: ${scopeId} removed from user: ${userId} by ${userSession.id}:${userSession.email}`,
        data: { userId, scopeId },
        user: userSession
      })
    } catch (error) {
      request.yar.flash(sessionNames.globalValidationFailures, error.message)
    }

    return h.redirect('/')
  }
}

export { removeTestAsTenantScopeController }
