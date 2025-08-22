import { authScope } from '../helpers/auth/auth-scope.js'

/**
 * @type { Record<string, string> }
 */
const scopes = {
  admin: 'admin',
  tenant: 'tenant',
  serviceOwner: 'serviceOwner',
  externalTest: 'externalTest',
  canGrantProdAccess: 'canGrantProdAccess',
  prodAccess: 'prodAccess',
  restrictedTechPython: 'restrictedTechPython',
  restrictedTechPostgres: 'restrictedTechPostgres',
  testAsTenant: 'testAsTenant'
}

const serviceOwnerOrAdminUserScope = authScope([
  scopes.admin,
  scopes.serviceOwner
])

export { scopes, serviceOwnerOrAdminUserScope }
