import {
  commonTestSuiteExtensions,
  provideNotFoundIfPrototypeExtension
} from '#server/common/helpers/ext/extensions.js'
import { provideFormContextValues } from '#server/common/helpers/form/provide-form-context-values.js'
import { adminUserScope } from '#server/common/constants/scopes.js'

import list from './controllers/list.js'
import create from './controllers/create.js'
import remove, { postRemove } from './controllers/remove.js'

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
        ].map(adminUserScope) // TODO: Change to serviceOwnerOrAdminUserScope once admin only testing is complete
      )
    }
  }
}
