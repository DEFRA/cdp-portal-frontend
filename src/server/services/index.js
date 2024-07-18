import {
  serviceController,
  serviceSecretsController,
  serviceEnvironmentSecretsController,
  serviceListController,
  serviceStatusController
} from '~/src/server/services/controllers'
import { provideTabs } from '~/src/server/services/helpers/provide-tabs'
import { provideSubNavigation } from '~/src/server/services/helpers/provide-sub-navigation'

const services = {
  plugin: {
    name: 'services',
    register: (server) => {
      server.ext([
        {
          type: 'onPostHandler',
          method: provideTabs,
          options: {
            sandbox: 'plugin'
          }
        },
        {
          type: 'onPostHandler',
          method: provideSubNavigation,
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
          path: '/services/{serviceId}/secrets',
          ...serviceSecretsController
        },
        {
          method: 'GET',
          path: '/services/{serviceId}/secrets/{environment}',
          ...serviceEnvironmentSecretsController
        },
        {
          method: 'GET',
          path: '/services/create-status/{serviceId}',
          ...serviceStatusController
        }
      ])
    }
  }
}

export { services }
