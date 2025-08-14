import {
  commonTestSuiteExtensions,
  provideNotFoundIfPrototypeExtension
} from '../../../common/helpers/ext/extensions.js'
import { allSecretsController } from '../../../common/patterns/entities/tabs/secrets/controllers/all.js'
import { provideFormContextValues } from '../../../common/helpers/form/provide-form-context-values.js'
import { provideSubNav } from '../../../helpers/provide-sub-navigation.js'
import { environmentSecretsController } from '../../../common/patterns/entities/tabs/secrets/controllers/environment.js'
import { serviceOwnerOrAdminUserScope } from '../../../common/constants/scopes.js'
import { updateSecretFormController } from '../../../common/patterns/entities/tabs/secrets/controllers/update-form.js'
import { updateSecretController } from '../../../common/patterns/entities/tabs/secrets/controllers/update.js'
import { createSecretController } from '../../../common/patterns/entities/tabs/secrets/controllers/create.js'
import { TEST_SUITE } from '../../../common/patterns/entities/tabs/constants.js'

export const testSuiteSecrets = {
  plugin: {
    name: 'testSuiteSecrets',
    register: (server) => {
      server.ext([
        ...commonTestSuiteExtensions,
        provideNotFoundIfPrototypeExtension,
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
          method: provideSubNav('secrets', TEST_SUITE),
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
