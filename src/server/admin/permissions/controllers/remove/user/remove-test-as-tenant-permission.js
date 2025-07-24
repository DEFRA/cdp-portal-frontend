import { sessionNames } from '../../../../../common/constants/session-names.js'
import {
  fetchPermissionsScopeByName,
  removeScopeFromUser
} from '../../../helpers/fetchers.js'
import { provideAuthedUser } from '../../../../../common/helpers/auth/pre/provide-authed-user.js'
import { scopes } from '../../../../../common/constants/scopes.js'

const removeTestAsTenantScopeController = {
  options: {
    id: 'admin/removeTestAsTenant',
    pre: [provideAuthedUser]
  },
  handler: async (request, h) => {
    const authedUser = await request.pre.authedUser

    try {
      const { scope } = await fetchPermissionsScopeByName(
        request,
        scopes.testAsTenant
      )
      await removeScopeFromUser(request, authedUser.id, scope.scopeId)
    } catch (error) {
      request.yar.flash(sessionNames.globalValidationFailures, error.message)
    }

    return h.redirect('/')
  }
}

export { removeTestAsTenantScopeController }
