import {
  allSecretsController,
  environmentSecretsController,
  updateSecretController,
  createSecretController,
  updateSecretFormController
} from '~/src/server/services/secrets/controllers'
import { scopes } from '~/src/server/common/constants/scopes'
import { authScope } from '~/src/server/common/helpers/auth/auth-scope'
import { provideTabs } from '~/src/server/services/helpers/provide-tabs'
import { provideSubNavigation } from '~/src/server/services/secrets/helpers/provide-sub-navigation'
import { addServiceOwnerScope } from '~/src/server/services/secrets/helpers/add-service-owner-scope'
import { provideFormContextValues } from '~/src/server/common/helpers/form/provide-form-context-values'

const serviceOwnerOrAdminUserScope = authScope([
  scopes.admin,
  scopes.serviceOwner
])

const serviceSecrets = {
  plugin: {
    name: 'serviceSecrets',
    register: (server) => {
      server.ext([
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
        },
        {
          type: 'onPostHandler',
          method: provideSubNavigation,
          options: {
            sandbox: 'plugin'
          }
        }
      ])

      server.route(
        [
          {
            method: 'GET',
            path: '/services/{serviceId}/secrets',
            ...allSecretsController
          },
          {
            method: 'GET',
            path: '/services/{serviceId}/secrets/{environment}',
            ...environmentSecretsController
          },
          {
            method: 'GET',
            path: '/services/{serviceId}/secrets/{environment}/update',
            ...updateSecretFormController
          },
          {
            method: 'POST',
            path: '/services/{serviceId}/secrets/{environment}/update',
            ...updateSecretController
          },
          {
            method: 'POST',
            path: '/services/{serviceId}/secrets/{environment}/create',
            ...createSecretController
          }
        ].map(serviceOwnerOrAdminUserScope)
      )
    }
  }
}

export { serviceSecrets }
