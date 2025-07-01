import { sessionNames } from '~/src/server/common/constants/session-names.js'
import {
  fetchPermissionsScopeByName,
  removeScopeFromUser
} from '~/src/server/admin/permissions/helpers/fetchers.js'
import { provideAuthedUser } from '~/src/server/common/helpers/auth/pre/provide-authed-user.js'
import { scopes } from '~/src/server/common/constants/scopes.js'

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
