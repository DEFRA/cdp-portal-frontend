import { allSecretsController } from '~/src/server/services/service/secrets/controllers/all.js'
import { environmentSecretsController } from '~/src/server/services/service/secrets/controllers/environment.js'
import { updateSecretController } from '~/src/server/services/service/secrets/controllers/update.js'
import { createSecretController } from '~/src/server/services/service/secrets/controllers/create.js'
import { updateSecretFormController } from '~/src/server/services/service/secrets/controllers/update-form.js'
import { scopes } from '~/src/server/common/constants/scopes.js'
import { authScope } from '~/src/server/common/helpers/auth/auth-scope.js'
import { provideTabs } from '~/src/server/services/helpers/provide-tabs.js'
import { provideSubNavigation } from '~/src/server/services/service/secrets/helpers/provide-sub-navigation.js'
import { provideFormContextValues } from '~/src/server/common/helpers/form/provide-form-context-values.js'
import { commonServiceExtensions } from '~/src/server/services/helpers/extensions.js'

const serviceOwnerOrAdminUserScope = authScope([
  scopes.admin,
  scopes.serviceOwner
])

const serviceSecrets = {
  plugin: {
    name: 'serviceSecrets',
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
