import { allSecretsController } from '~/src/server/common/tabs/secrets/controllers/all.js'
import { environmentSecretsController } from '~/src/server/common/tabs/secrets/controllers/environment.js'
import { updateSecretController } from '~/src/server/common/tabs/secrets/controllers/update.js'
import { createSecretController } from '~/src/server/common/tabs/secrets/controllers/create.js'
import { updateSecretFormController } from '~/src/server/common/tabs/secrets/controllers/update-form.js'
import { provideServiceTabs } from '~/src/server/services/helpers/provide-service-tabs.js'
import { provideFormContextValues } from '~/src/server/common/helpers/form/provide-form-context-values.js'
import { commonServiceExtensions } from '~/src/server/common/helpers/extensions.js'
import { serviceOwnerOrAdminUserScope } from '~/src/server/common/constants/scopes.js'
import { provideSubNavForServiceOrTestSuite } from '~/src/server/helpers/provide-sub-navigation.js'
import { SERVICE } from '~/src/server/common/tabs/constants.js'

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
        // TODO can these postHandlers be combined?
        {
          type: 'onPostHandler',
          method: provideServiceTabs,
          options: {
            sandbox: 'plugin'
          }
        },
        {
          type: 'onPostHandler',
          method: provideSubNavForServiceOrTestSuite('secrets', SERVICE),
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
            ...allSecretsController(SERVICE)
          },
          {
            method: 'GET',
            path: '/services/{serviceId}/secrets/{environment}',
            ...environmentSecretsController(SERVICE)
          },
          {
            method: 'GET',
            path: '/services/{serviceId}/secrets/{environment}/update',
            ...updateSecretFormController(SERVICE)
          },
          {
            method: 'POST',
            path: '/services/{serviceId}/secrets/{environment}/update',
            ...updateSecretController(SERVICE)
          },
          {
            method: 'POST',
            path: '/services/{serviceId}/secrets/{environment}/create',
            ...createSecretController(SERVICE)
          }
        ].map(serviceOwnerOrAdminUserScope)
      )
    }
  }
}

export { serviceSecrets }
