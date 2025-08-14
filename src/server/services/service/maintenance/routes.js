import { scopes } from '../../../common/constants/scopes.js'
import { authScope } from '../../../common/helpers/auth/auth-scope.js'
import { commonServiceExtensions } from '../../../common/helpers/ext/extensions.js'
import { provideFormContextValues } from '../../../common/helpers/form/provide-form-context-values.js'
import { updateShutteringStatusController } from './controllers/update-shuttering-status.js'
import { confirmShutterController } from './controllers/confirm-shutter.js'
import { confirmUndeployController } from './controllers/confirm-undeploy.js'
import { maintenanceController } from './controllers/maintenance.js'
import { undeployController } from './controllers/undeploy.js'

const serviceTeamAndAdminScope = authScope([scopes.serviceOwner, scopes.admin])

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
        ].map(serviceTeamAndAdminScope)
      )
    }
  }
}

export { serviceMaintenance }
