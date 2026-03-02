import { authScope } from '../helpers/auth/auth-scope.js'
import { scopes } from '@defra/cdp-validation-kit'

export const serviceOwnerOrAdminUserScope = authScope([
  scopes.admin,
  scopes.serviceOwner
])

export const adminUserScope = authScope([scopes.admin])
