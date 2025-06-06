import { scopes } from '~/src/server/common/constants/scopes.js'
import { authScope } from '~/src/server/common/helpers/auth/auth-scope.js'
import { commonServiceExtensions } from '~/src/server/common/helpers/extensions.js'
import { provideFormContextValues } from '~/src/server/common/helpers/form/provide-form-context-values.js'
import { updateShutteringStatusController } from '~/src/server/services/service/maintenance/controllers/update-shuttering-status.js'
import { confirmShutterController } from '~/src/server/services/service/maintenance/controllers/confirm-shutter.js'
import { confirmUndeployController } from '~/src/server/services/service/maintenance/controllers/confirm-undeploy.js'
import { maintenanceController } from '~/src/server/services/service/maintenance/controllers/maintenance.js'
import { undeployController } from '~/src/server/services/service/maintenance/controllers/undeploy.js'

const serviceTeamAndAdminWithShutteringRestrictedTechScope = authScope([
  scopes.serviceOwner,
  scopes.admin,
  `+${scopes.restrictedTechMaintenance}`
])

const serviceMaintenance = {
  plugin: {
    name: 'serviceMaintenance',
    register: (server) => {
      server.ext([
        ...commonServiceExtensions,
        {
          type: 'onPostHandler',
          method: provideFormContextValues(),
          options: {
            before: ['yar'],
            sandbox: 'plugin'
          }
        }
      ])

      server.route(
        [
          {
            method: 'GET',
            path: '/services/{serviceId}/maintenance',
            ...maintenanceController
          },
          {
            method: 'GET',
            path: '/services/{serviceId}/maintenance/shuttering',
            ...confirmShutterController
          },
          {
            method: 'POST',
            path: '/services/{serviceId}/maintenance/shuttering',
            ...updateShutteringStatusController
          },
          {
            method: 'GET',
            path: '/services/{serviceId}/maintenance/undeploy',
            ...confirmUndeployController
          },
          {
            method: 'POST',
            path: '/services/{serviceId}/maintenance/undeploy',
            ...undeployController
          }
        ].map(serviceTeamAndAdminWithShutteringRestrictedTechScope)
      )
    }
  }
}

export { serviceMaintenance }
