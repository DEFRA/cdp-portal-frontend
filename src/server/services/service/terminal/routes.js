import { launchTerminalController } from './controllers/launch-terminal.js'
import { terminalController } from './controllers/terminal.js'
import { terminalBrowserController } from './controllers/terminal-browser.js'
import { scopes } from '@defra/cdp-validation-kit/src/constants/scopes.js'
import { authScope } from '../../../common/helpers/auth/auth-scope.js'
import { provideFormContextValues } from '../../../common/helpers/form/provide-form-context-values.js'
import {
  commonServiceExtensions,
  provideNotFoundIfPrototypeExtension
} from '../../../common/helpers/ext/extensions.js'

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
        provideNotFoundIfPrototypeExtension,
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
