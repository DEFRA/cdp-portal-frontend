import {
  commonTestSuiteExtensions,
  provideNotFoundIfPrototypeExtension
} from '#server/common/helpers/ext/extensions.js'
import { provideFormContextValues } from '#server/common/helpers/form/provide-form-context-values.js'
import { adminUserScope } from '#server/common/constants/scopes.js'

import list from './controllers/list.js'
import create from './controllers/create.js'
import remove, { postRemove } from './controllers/remove.js'
// import update, { postUpdate } from './controllers/update.js'

export default {
  plugin: {
    name: 'testSuiteNotifications',
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
            path: '/test-suites/{serviceId}/notifications',
            ...list
          },
          {
            method: 'POST',
            path: '/test-suites/{serviceId}/notifications/create',
            ...create
          },
          {
            method: 'GET',
            path: '/test-suites/{serviceId}/notifications/{notificationId}/remove',
            ...remove
          },
          {
            method: 'POST',
            path: '/test-suites/{serviceId}/notifications/{notificationId}/remove',
            ...postRemove
          }
          // {
          //   method: 'GET',
          //   path: '/test-suites/{serviceId}/notifications/{notificationId}/update',
          //   ...update
          // },
          // {
          //   method: 'POST',
          //   path: '/test-suites/{serviceId}/notifications/{notificationId}/update',
          //   ...postUpdate
          // }
        ].map(adminUserScope) // TODO: Change to serviceOwnerOrAdminUserScope once admin only testing is complete
      )
    }
  }
}
