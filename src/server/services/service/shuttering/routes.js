import { scopes } from '~/src/server/common/constants/scopes.js'
import { authScope } from '~/src/server/common/helpers/auth/auth-scope.js'
import { commonServiceExtensions } from '~/src/server/common/helpers/extensions.js'
import { shutteringController } from '~/src/server/services/service/shuttering/controllers/shuttering.js'
import { provideFormContextValues } from '~/src/server/common/helpers/form/provide-form-context-values.js'
import { updateShutteringStatusController } from '~/src/server/services/service/shuttering/controllers/update-shuttering-status.js'
import { updateCustomMessageController } from '~/src/server/services/service/shuttering/controllers/update-custom-message.js'
import { confirmShutterController } from '~/src/server/services/service/shuttering/controllers/confirm-shutter.js'

const serviceTeamAndAdminWithShutteringRestrictedTechScope = authScope([
  scopes.tenant,
  scopes.admin,
  `+${scopes.restrictedTechShuttering}`
])

const serviceShuttering = {
  plugin: {
    name: 'serviceShuttering',
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
            path: '/services/{serviceId}/shuttering',
            ...shutteringController
          },
          {
            method: 'POST',
            path: '/services/{serviceId}/shuttering',
            ...updateShutteringStatusController
          },
          {
            method: 'GET',
            path: '/services/{serviceId}/shuttering/confirm',
            ...confirmShutterController
          },
          {
            method: 'POST',
            path: '/services/{serviceId}/shuttering/custom-message',
            ...updateCustomMessageController
          }
        ].map(serviceTeamAndAdminWithShutteringRestrictedTechScope)
      )
    }
  }
}

export { serviceShuttering }
