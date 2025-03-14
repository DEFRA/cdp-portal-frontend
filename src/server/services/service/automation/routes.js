import { scopes } from '~/src/server/common/constants/scopes.js'
import { authScope } from '~/src/server/common/helpers/auth/auth-scope.js'
import { commonServiceExtensions } from '~/src/server/services/helpers/extensions.js'
import { automationController } from '~/src/server/services/service/automation/controllers/automation.js'
import { provideFormContextValues } from '~/src/server/common/helpers/form/provide-form-context-values.js'
import { autoDeployController } from '~/src/server/services/service/automation/controllers/auto-deploy.js'

const serviceOwnerOrAdminUserScope = authScope([
  scopes.admin,
  scopes.serviceOwner
])

const serviceAutomation = {
  plugin: {
    name: 'serviceAutomation',
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
            path: '/services/{serviceId}/automation',
            ...automationController
          },
          {
            method: 'POST',
            path: '/services/{serviceId}/automation/auto-deploy',
            ...autoDeployController
          }
        ].map(serviceOwnerOrAdminUserScope)
      )
    }
  }
}

export { serviceAutomation }
