import { authScope } from '~/src/server/common/helpers/auth/auth-scope'
import { provideSubNavigation } from '~/src/server/admin/helpers/provide-sub-navigation'
import { provideUserSteps } from '~/src/server/admin/users/helpers/form'
import { provideFormContextValues } from '~/src/server/common/helpers/form/provide-form-context-values'
import { sessionNames } from '~/src/server/common/constants/session-names'
import {
  usersListController,
  userController,
  findAadUserFormController,
  startCreateUserController,
  findAadUserController,
  findGithubUserFormController,
  findGithubUserController,
  userDetailsController,
  userDetailsFormController,
  userSummaryController,
  createUserController,
  startEditUserController,
  editUserController,
  confirmDeleteUserController,
  deleteUserController
} from '~/src/server/admin/users/controllers'
import { scopes } from '~/src/server/common/constants/scopes'
import { fetchCdpUser } from '~/src/server/admin/users/helpers/fetch'

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

      server.method('fetchCdpUser', fetchCdpUser, {
        cache: {
          expiresIn: 60 * 1000,
          staleIn: 40 * 1000,
          staleTimeout: 10 * 1000,
          generateTimeout: 100
        }
      })

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
        ].map(adminScope)
      )
    }
  }
}
export { adminUsers }
