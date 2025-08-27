import { authScope } from '../helpers/auth/auth-scope.js'
import { scopes } from '@defra/cdp-validation-kit/src/constants/scopes.js'

const serviceOwnerOrAdminUserScope = authScope([
  scopes.admin,
  scopes.serviceOwner
])

export { serviceOwnerOrAdminUserScope }
