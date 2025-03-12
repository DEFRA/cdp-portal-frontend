import { authScope } from '~/src/server/common/helpers/auth/auth-scope.js'

const scopes = {
  admin: 'admin',
  tenant: 'tenant',
  serviceOwner: 'serviceOwner',
  externalTest: 'externalTest',
  breakGlass: 'breakGlass',
  restrictedTechPython: 'restrictedTechPython'
}

const serviceOwnerOrAdminUserScope = authScope([
  scopes.admin,
  scopes.serviceOwner
])

export { scopes, serviceOwnerOrAdminUserScope }
