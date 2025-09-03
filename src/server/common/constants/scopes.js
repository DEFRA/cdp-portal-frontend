import { authScope } from '../helpers/auth/auth-scope.js'
import { scopes } from '@defra/cdp-validation-kit'

const serviceOwnerOrAdminUserScope = authScope([
  scopes.admin,
  scopes.serviceOwner
])

export { serviceOwnerOrAdminUserScope }
