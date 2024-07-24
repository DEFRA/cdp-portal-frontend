import {
  serviceController,
  secretsController,
  environmentSecretsController,
  serviceListController,
  serviceStatusController,
  updateEnvironmentSecretFormController,
  createEnvironmentSecretController,
  updateEnvironmentSecretController
} from '~/src/server/services/controllers'
import { provideTabs } from '~/src/server/services/helpers/provide-tabs'
import { provideSubNavigation } from '~/src/server/services/helpers/provide-sub-navigation'
import { provideFormContextValues } from '~/src/server/common/helpers/form/provide-form-context-values'

const services = {
  plugin: {
    name: 'services',
    register: (server) => {
      server.ext([
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
          ...secretsController
        },
        {
          method: 'GET',
          path: '/services/{serviceId}/secrets/{environment}/update',
          ...updateEnvironmentSecretFormController
        },
        {
          method: 'POST',
          path: '/services/{serviceId}/secrets/{environment}/update',
          ...updateEnvironmentSecretController
        },
        {
          method: 'POST',
          path: '/services/{serviceId}/secrets/{environment}/create',
          ...createEnvironmentSecretController
        },
        {
          method: 'GET',
          path: '/services/{serviceId}/secrets/{environment}',
          ...environmentSecretsController
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
