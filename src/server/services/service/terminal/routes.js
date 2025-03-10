import { launchTerminalController } from '~/src/server/services/service/terminal/controllers/launch-terminal.js'
import { terminalController } from '~/src/server/services/service/terminal/controllers/terminal.js'
import { terminalBrowserController } from '~/src/server/services/service/terminal/controllers/terminal-browser.js'
import { scopes } from '~/src/server/common/constants/scopes.js'
import { authScope } from '~/src/server/common/helpers/auth/auth-scope.js'
import { addServiceOwnerScope } from '~/src/server/services/helpers/add-service-owner-scope.js'
import { provideFormContextValues } from '~/src/server/common/helpers/form/provide-form-context-values.js'
import { commonServiceExtensions } from '~/src/server/services/helpers/extensions.js'

const serviceOwnerOrAdminUserScope = authScope([
  scopes.admin,
  scopes.serviceOwner
])

const serviceTerminal = {
  plugin: {
    name: 'serviceTerminal',
    register: (server) => {
      server.ext([
        ...commonServiceExtensions,
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
        }
      ])

      server.route(
        [
          {
            method: 'GET',
            path: '/services/{serviceId}/terminal',
            ...terminalController
          },
          {
            method: 'POST',
            path: '/services/{serviceId}/terminal/{environment}',
            ...launchTerminalController
          },
          {
            method: 'GET',
            path: '/services/{serviceId}/terminal/{environment}/{token}',
            ...terminalBrowserController
          }
        ].map(serviceOwnerOrAdminUserScope)
      )
    }
  }
}

export { serviceTerminal }
