import { authScope } from '../../common/helpers/auth/auth-scope.js'
import { provideSubNavigation } from '../helpers/provide-sub-navigation.js'
import { provideUserSteps } from './helpers/form/index.js'
import { provideFormContextValues } from '../../common/helpers/form/provide-form-context-values.js'
import { sessionNames } from '../../common/constants/session-names.js'
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
  usersListController,
  userSummaryController
} from './controllers/index.js'
import { scopes } from '@defra/cdp-validation-kit/src/constants/scopes.js'

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
