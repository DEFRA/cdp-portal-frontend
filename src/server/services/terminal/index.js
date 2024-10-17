import {
  launchTerminalController,
  webShellController,
  webShellBrowserController
} from '~/src/server/services/terminal/controllers'
import { scopes } from '~/src/server/common/constants/scopes'
import { authScope } from '~/src/server/common/helpers/auth/auth-scope'
import { provideTabs } from '~/src/server/services/helpers/provide-tabs'
import { provideService } from '~/src/server/services/helpers/provide-service'
import { addServiceOwnerScope } from '~/src/server/services/helpers/add-service-owner-scope'
import { provideFormContextValues } from '~/src/server/common/helpers/form/provide-form-context-values'

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
        ].map(serviceOwnerOrAdminUserScope)
      )
    }
  }
}

export { serviceTerminal }
