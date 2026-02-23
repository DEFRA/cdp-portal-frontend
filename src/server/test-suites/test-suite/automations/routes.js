import { scopes } from '@defra/cdp-validation-kit'
import { authScope } from '#server/common/helpers/auth/auth-scope.js'
import {
  commonTestSuiteExtensions,
  provideNotFoundIfPrototypeExtension
} from '#server/common/helpers/ext/extensions.js'
import list from './controllers/list.js'
import create from './controllers/create.js'

const serviceTeamAndAdminUserScope = authScope([scopes.tenant, scopes.admin])

export const testSuiteAutomations = {
  plugin: {
    name: 'testSuiteAutomations',
    register: (server) => {
      server.ext([
        ...commonTestSuiteExtensions,
        provideNotFoundIfPrototypeExtension
      ])

      server.route(
        [
          {
            method: 'GET',
            path: '/test-suites/{serviceId}/automations',
            ...list
          },
          {
            method: 'POST',
            path: '/test-suites/{serviceId}/automations/create-schedule',
            ...create
          }
        ].map(serviceTeamAndAdminUserScope)
      )
    }
  }
}
