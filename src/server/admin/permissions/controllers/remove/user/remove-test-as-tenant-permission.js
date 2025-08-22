import { scopes } from '../../../../../common/constants/scopes.js'
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
      const { scope } = await fetchPermissionByName(
        request,
        scopes.testAsTenant
      )
      await removeScopeFromUser({
        request,
        userId: userSession?.id,
        scopeId: scope.scopeId
      })
    } catch (error) {
      request.yar.flash(sessionNames.globalValidationFailures, error.message)
    }

    return h.redirect('/')
  }
}

export { removeTestAsTenantScopeController }
