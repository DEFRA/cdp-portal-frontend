import { authScope } from '~/src/server/common/helpers/auth/auth-scope.js'
import { provideSubNavigation } from '~/src/server/admin/helpers/provide-sub-navigation.js'
import { provideUserSteps } from '~/src/server/admin/users/helpers/form/index.js'
import { provideFormContextValues } from '~/src/server/common/helpers/form/provide-form-context-values.js'
import { sessionNames } from '~/src/server/common/constants/session-names.js'
import {
  confirmDeleteUserController,
  createUserController,
  deleteUserController,
  editUserController,
  findAadUserController,
  findAadUserFormController,
  findGithubUserController,
  findGithubUserFormController,
  startCreateUserController,
  startEditUserController,
  userController,
  userDetailsController,
  userDetailsFormController,
  usersListController,
  userSummaryController
} from '~/src/server/admin/users/controllers/index.js'
import { scopes } from '~/src/server/common/constants/scopes.js'
import { withTracing } from '~/src/server/common/helpers/tracing/tracing.js'

const adminScope = authScope([`+${scopes.admin}`])

const adminUsers = {
  plugin: {
    name: 'users',
    register: (server) => {
      server.ext([
        {
          type: 'onPostHandler',
          method: provideSubNavigation,
          options: {
            sandbox: 'plugin'
          }
        },
        {
          type: 'onPostHandler',
          method: provideFormContextValues(sessionNames.cdpUser),
          options: {
            before: ['yar'],
            sandbox: 'plugin'
          }
        },
        {
          type: 'onPostHandler',
          method: provideUserSteps,
          options: {
            sandbox: 'plugin'
          }
        }
      ])

      server.route(
        [
          {
            method: 'GET',
            path: '/admin/users/create',
            ...startCreateUserController
          },
          {
            method: 'POST',
            path: '/admin/users/create',
            ...createUserController
          },
          {
            method: 'POST',
            path: '/admin/users/edit',
            ...editUserController
          },
          {
            method: 'GET',
            path: '/admin/users/{userId}/edit',
            ...startEditUserController
          },
          {
            method: 'GET',
            path: '/admin/users/{userId}/confirm-delete',
            ...confirmDeleteUserController
          },
          {
            method: 'POST',
            path: '/admin/users/{userId}/delete',
            ...deleteUserController
          },
          {
            method: 'GET',
            path: '/admin/users/find-aad-user',
            ...findAadUserFormController
          },
          {
            method: 'POST',
            path: '/admin/users/find-aad-user',
            ...findAadUserController
          },
          {
            method: 'GET',
            path: '/admin/users/find-github-user',
            ...findGithubUserFormController
          },
          {
            method: 'POST',
            path: '/admin/users/find-github-user',
            ...findGithubUserController
          },
          {
            method: 'GET',
            path: '/admin/users/user-details',
            ...userDetailsFormController
          },
          {
            method: 'POST',
            path: '/admin/users/user-details',
            ...userDetailsController
          },
          {
            method: 'GET',
            path: '/admin/users/summary',
            ...userSummaryController
          },
          {
            method: 'GET',
            path: '/admin/users',
            ...usersListController
          },
          {
            method: 'GET',
            path: '/admin/users/{userId}',
            ...userController
          }
        ]
          .map(adminScope)
          .map(withTracing)
      )
    }
  }
}
export { adminUsers }
