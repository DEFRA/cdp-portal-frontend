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
    try {
      const scope = await fetchPermissionByName(
        request,
        scopes.testAsTenant.replace('permission:', '')
      )
      const scopeId = scope.scopeId
      const userId = request.auth.credentials.id

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
        event: `permission: ${scopeId} removed from user: ${userId}`,
        data: { userId, scopeId }
      })
    } catch (error) {
      request.yar.flash(sessionNames.globalValidationFailures, error.message)
    }

    return h.redirect('/')
  }
}

export { removeTestAsTenantScopeController }
