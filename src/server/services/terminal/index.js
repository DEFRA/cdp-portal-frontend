import {
  launchTerminalController,
  webShellController,
  webShellBrowserController
} from '~/src/server/services/terminal/controllers/index.js'
import { scopes } from '~/src/server/common/constants/scopes.js'
import { authScope } from '~/src/server/common/helpers/auth/auth-scope.js'
import { provideTabs } from '~/src/server/services/helpers/provide-tabs.js'
import { provideService } from '~/src/server/services/helpers/provide-service.js'
import { addServiceOwnerScope } from '~/src/server/services/helpers/add-service-owner-scope.js'
import { provideFormContextValues } from '~/src/server/common/helpers/form/provide-form-context-values.js'
import { withTracing } from '~/src/server/common/helpers/tracing/tracing.js'

const serviceOwnerOrAdminUserScope = authScope([
  scopes.admin,
  scopes.serviceOwner
])

const serviceTerminal = {
  plugin: {
    name: 'serviceTerminal',
    register: (server) => {
      server.ext([
        {
          type: 'onPreAuth',
          method: provideService,
          options: {
            sandbox: 'plugin'
          }
        },
        {
          type: 'onCredentials',
          method: addServiceOwnerScope,
          options: {
            sandbox: 'plugin'
          }
        },
        {
          type: 'onPostHandler',
          method: provideFormContextValues(),
          options: {
            before: ['yar'],
            sandbox: 'plugin'
          }
        },
        {
          type: 'onPostHandler',
          method: provideTabs,
          options: {
            sandbox: 'plugin'
          }
        }
      ])

      server.route(
        [
          {
            method: 'GET',
            path: '/services/{serviceId}/terminal',
            ...webShellController
          },
          {
            method: 'POST',
            path: '/services/{serviceId}/terminal/{environment}',
            ...launchTerminalController
          },
          {
            method: 'GET',
            path: '/services/{serviceId}/terminal/{environment}/{token}',
            ...webShellBrowserController
          }
        ]
          .map(serviceOwnerOrAdminUserScope)
          .map(withTracing)
      )
    }
  }
}

export { serviceTerminal }
