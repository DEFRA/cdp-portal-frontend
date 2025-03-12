import { allSecretsController } from '~/src/server/services/service/secrets/controllers/all.js'
import { environmentSecretsController } from '~/src/server/services/service/secrets/controllers/environment.js'
import { updateSecretController } from '~/src/server/services/service/secrets/controllers/update.js'
import { createSecretController } from '~/src/server/services/service/secrets/controllers/create.js'
import { updateSecretFormController } from '~/src/server/services/service/secrets/controllers/update-form.js'
import { provideTabs } from '~/src/server/services/helpers/provide-tabs.js'
import { provideFormContextValues } from '~/src/server/common/helpers/form/provide-form-context-values.js'
import { commonServiceExtensions } from '~/src/server/services/helpers/extensions.js'
import { serviceOwnerOrAdminUserScope } from '~/src/server/common/constants/scopes.js'
import { provideSubNavForServiceOrTestSuite } from '~/src/server/common/extensions/provide-sub-navigation.js'

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
          method: provideSubNavForServiceOrTestSuite('secrets', 'service'),
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
            ...allSecretsController('service')
          },
          {
            method: 'GET',
            path: '/services/{serviceId}/secrets/{environment}',
            ...environmentSecretsController('service')
          },
          {
            method: 'GET',
            path: '/services/{serviceId}/secrets/{environment}/update',
            ...updateSecretFormController('service')
          },
          {
            method: 'POST',
            path: '/services/{serviceId}/secrets/{environment}/update',
            ...updateSecretController('service')
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
