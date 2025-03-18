import { provideTabs } from '~/src/server/test-suites/helpers/provide-tabs.js'
import {
  addServiceOwnerScopeExtension,
  provideServiceExtension
} from '~/src/server/common/helpers/extensions.js'
import { allSecretsController } from '~/src/server/common/tabs/secrets/controllers/all.js'
import { provideFormContextValues } from '~/src/server/common/helpers/form/provide-form-context-values.js'
import { provideSubNavForServiceOrTestSuite } from '~/src/server/helpers/provide-sub-navigation.js'
import { environmentSecretsController } from '~/src/server/common/tabs/secrets/controllers/environment.js'
import { serviceOwnerOrAdminUserScope } from '~/src/server/common/constants/scopes.js'
import { updateSecretFormController } from '~/src/server/common/tabs/secrets/controllers/update-form.js'
import { updateSecretController } from '~/src/server/common/tabs/secrets/controllers/update.js'
import { createSecretController } from '~/src/server/common/tabs/secrets/controllers/create.js'
import { TEST_SUITE } from '~/src/server/common/tabs/constants.js'

export const testSuiteSecrets = {
  plugin: {
    name: 'testSuiteSecrets',
    register: (server) => {
      server.ext([
        provideServiceExtension,
        addServiceOwnerScopeExtension,
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
          method: provideSubNavForServiceOrTestSuite('secrets', TEST_SUITE),
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
            ...allSecretsController(TEST_SUITE)
          },
          {
            method: 'GET',
            path: '/test-suites/{serviceId}/secrets/{environment}',
            ...environmentSecretsController(TEST_SUITE)
          },
          {
            method: 'GET',
            path: '/test-suites/{serviceId}/secrets/{environment}/update',
            ...updateSecretFormController(TEST_SUITE)
          },
          {
            method: 'POST',
            path: '/test-suites/{serviceId}/secrets/{environment}/update',
            ...updateSecretController(TEST_SUITE)
          },
          {
            method: 'POST',
            path: '/test-suites/{serviceId}/secrets/{environment}/create',
            ...createSecretController(TEST_SUITE)
          }
        ].map(serviceOwnerOrAdminUserScope)
      )
    }
  }
}
