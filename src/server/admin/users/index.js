import {
  usersListController,
  userController,
  findAadUserFormController,
  startCreateUserController,
  findAadUserController,
  findGitHubUserFormController,
  findGitHubUserController,
  userDetailsController,
  userDetailsFormController,
  summaryController,
  createUserController,
  startEditUserController,
  editUserController
} from '~/src/server/admin/users/controllers'
import { provideUserSteps } from '~/src/server/admin/users/helpers/journey'
import { provideSubNav } from '~/src/server/admin/helpers/provide-sub-nav'
import { provideFormContextValues } from '~/src/server/admin/users/helpers/provide-form-context-values'

const adminUsers = {
  plugin: {
    name: 'users',
    register: (server) => {
      server.ext([
        {
          type: 'onPostHandler',
          method: provideSubNav,
          options: {
            sandbox: 'plugin'
          }
        },
        {
          type: 'onPostHandler',
          method: provideFormContextValues,
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

      server.route([
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
          method: 'GET',
          path: '/admin/users/edit/{userId}',
          ...startEditUserController
        },
        {
          method: 'POST',
          path: '/admin/users/edit',
          ...editUserController
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
          ...findGitHubUserFormController
        },
        {
          method: 'POST',
          path: '/admin/users/find-github-user',
          ...findGitHubUserController
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
          ...summaryController
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
      ])
    }
  }
}
export { adminUsers }
