import { provideTabs } from '~/src/server/test-suites/helpers/provide-tabs.js'
import { validateServiceIsATestSuite } from '~/src/server/services/helpers/validate-service-is-a-test-suite.js'
import { provideServiceExtension } from '~/src/server/services/helpers/extensions.js'
import { allSecretsController } from '~/src/server/services/service/secrets/controllers/all.js'
import { provideFormContextValues } from '~/src/server/common/helpers/form/provide-form-context-values.js'
import { provideSubNavForServiceOrTestSuite } from '~/src/server/common/extensions/provide-sub-navigation.js'
import { environmentSecretsController } from '~/src/server/services/service/secrets/controllers/environment.js'
import { serviceOwnerOrAdminUserScope } from '~/src/server/common/constants/scopes.js'
import { updateSecretFormController } from '~/src/server/services/service/secrets/controllers/update-form.js'

export const testSuiteSecrets = {
  plugin: {
    name: 'testSuiteSecrets',
    register: (server) => {
      server.ext([
        provideServiceExtension,
        {
          type: 'onPreHandler',
          method: validateServiceIsATestSuite,
          options: {
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
          method: provideFormContextValues(),
          options: {
            before: ['yar'],
            sandbox: 'plugin'
          }
        },
        {
          type: 'onPostHandler',
          method: provideSubNavForServiceOrTestSuite('secrets', 'test-suite'),
          options: {
            sandbox: 'plugin'
          }
        }
      ])

      server.route(
        [
          {
            method: 'GET',
            path: '/test-suites/{serviceId}/secrets',
            ...allSecretsController('test-suite')
          },
          {
            method: 'GET',
            path: '/test-suites/{serviceId}/secrets/{environment}',
            ...environmentSecretsController('test-suite')
          },
          {
            method: 'GET',
            path: '/test-suites/{serviceId}/secrets/{environment}/update',
            ...updateSecretFormController('test-suite')
          }
          // {
          //   method: 'POST',
          //   path: '/test-suites/{serviceId}/secrets/{environment}/update',
          //   ...updateSecretController
          // },
          // {
          //   method: 'POST',
          //   path: '/test-suites/{serviceId}/secrets/{environment}/create',
          //   ...createSecretController
          // }
        ].map(serviceOwnerOrAdminUserScope)
      )
    }
  }
}
