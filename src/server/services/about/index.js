import {
  serviceController,
  serviceListController,
  serviceCreateStatusController,
  launchWebShellController,
  webShellController
} from '~/src/server/services/about/controllers'
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

const aboutService = {
  plugin: {
    name: 'aboutService',
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

      server.route([
        {
          method: 'GET',
          path: '/services',
          ...serviceListController
        },
        {
          method: 'GET',
          path: '/services/{serviceId}',
          ...serviceController
        },
        {
          method: 'GET',
          // TODO align this url with the other services urls: '/services/{serviceId}/create-status'
          path: '/services/create-status/{serviceId}',
          ...serviceCreateStatusController
        }
      ])

      server.route(
        [
          {
            method: 'GET',
            path: '/services/{serviceId}/web-shell/{environment}',
            ...launchWebShellController
          },
          {
            method: 'GET',
            path: '/services/{serviceId}/web-shell/{environment}/{token}',
            ...webShellController
          }
        ].map(serviceOwnerOrAdminUserScope)
      )
    }
  }
}

export { aboutService }
