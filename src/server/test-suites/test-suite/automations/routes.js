import { scopes } from '@defra/cdp-validation-kit'
import { authScope } from '#server/common/helpers/auth/auth-scope.js'
import {
  commonTestSuiteExtensions,
  provideNotFoundIfPrototypeExtension
} from '#server/common/helpers/ext/extensions.js'
import { provideFormContextValues } from '#server/common/helpers/form/provide-form-context-values.js'

import list from './controllers/list.js'
import create from './controllers/create.js'
import remove, { postRemove } from './controllers/remove.js'

const serviceTeamAndAdminUserScope = authScope([scopes.tenant, scopes.admin])

export const testSuiteAutomations = {
  plugin: {
    name: 'testSuiteAutomations',
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
        }
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
            path: '/test-suites/{serviceId}/automations/schedules/create',
            ...create
          },
          {
            method: 'GET',
            path: '/test-suites/{serviceId}/automations/schedules/{scheduleId}/remove',
            ...remove
          },
          {
            method: 'POST',
            path: '/test-suites/{serviceId}/automations/schedules/{scheduleId}/remove',
            ...postRemove
          }
        ].map(serviceTeamAndAdminUserScope)
      )
    }
  }
}
