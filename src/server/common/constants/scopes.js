import { authScope } from '~/src/server/common/helpers/auth/auth-scope.js'

const scopes = {
  admin: 'admin',
  tenant: 'tenant',
  serviceOwner: 'serviceOwner',
  externalTest: 'externalTest',
  breakGlass: 'breakGlass',
  restrictedTechPython: 'restrictedTechPython',
  restrictedTechPostgres: 'restrictedTechPostgres'
}

const serviceOwnerOrAdminUserScope = authScope([
  scopes.admin,
  scopes.serviceOwner
])

function hasScope(request, scope) {
  const scopes = request.auth?.credentials?.scope ?? []
  return scopes.includes(scope)
}

export { scopes, serviceOwnerOrAdminUserScope, hasScope }
