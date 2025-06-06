import { authScope } from '~/src/server/common/helpers/auth/auth-scope.js'

/**
 * @type {{admin: string, tenant: string, serviceOwner: string, externalTest: string, breakGlass: string, restrictedTechPython: string, restrictedTechPostgres: string, restrictedTechMaintenance: string}}
 */
const scopes = {
  admin: 'admin',
  tenant: 'tenant',
  serviceOwner: 'serviceOwner',
  externalTest: 'externalTest',
  breakGlass: 'breakGlass',
  restrictedTechPython: 'restrictedTechPython',
  restrictedTechPostgres: 'restrictedTechPostgres',
  restrictedTechMaintenance: 'restrictedTechMaintenance'
}

const serviceOwnerOrAdminUserScope = authScope([
  scopes.admin,
  scopes.serviceOwner
])

export { scopes, serviceOwnerOrAdminUserScope }
