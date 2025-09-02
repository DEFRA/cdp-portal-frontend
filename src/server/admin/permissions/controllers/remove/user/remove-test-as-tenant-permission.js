import { scopes } from '@defra/cdp-validation-kit/src/constants/scopes.js'
import { sessionNames } from '../../../../../common/constants/session-names.js'
import {
  fetchPermissionsScopeByName,
  removeScopeFromUser
} from '../../../helpers/fetchers.js'

const removeTestAsTenantScopeController = {
  options: {
    id: 'admin/removeTestAsTenant'
  },
  handler: async (request, h) => {
    const userSession = await request.getUserSession()

    try {
      const scope = await fetchPermissionsScopeByName(
        request,
        scopes.testAsTenant.replace('permission:', '')
      )
      await removeScopeFromUser(request, userSession?.id, scope.scopeId)
    } catch (error) {
      request.yar.flash(sessionNames.globalValidationFailures, error.message)
    }

    return h.redirect('/')
  }
}

export { removeTestAsTenantScopeController }
