import { scopes } from '@defra/cdp-validation-kit'
import { authScope } from '#server/common/helpers/auth/auth-scope.js'
import {
  commonTestSuiteExtensions,
  provideNotFoundIfPrototypeExtension
} from '#server/common/helpers/ext/extensions.js'
import controller from './controller.js'

const serviceTeamAndAdminUserScope = authScope([scopes.tenant, scopes.admin])

export const testSuiteAutomations = {
  plugin: {
    name: 'testSuiteAutomations',
    register: (server) => {
      server.ext([
        ...commonTestSuiteExtensions,
        provideNotFoundIfPrototypeExtension
        // {
        //   type: 'onPostHandler',
        //   method: provideSubNav('automations', TEST_SUITE),
        //   options: {
        //     sandbox: 'plugin'
        //   }
        // }
      ])

      server.route(
        [
          {
            method: 'GET',
            path: '/test-suites/{serviceId}/automations',
            ...controller
          }
        ].map(serviceTeamAndAdminUserScope)
      )
    }
  }
}
