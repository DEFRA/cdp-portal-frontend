import { config } from '~/src/config'
import { addScope } from '~/src/server/common/helpers/auth/add-scope'
import { provideSubNav } from '~/src/server/admin/helpers/provide-sub-nav'
import {
  provideUserSteps,
  provideFormContextValues
} from '~/src/server/admin/users/helpers/form'
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
  editUserController
} from '~/src/server/admin/users/controllers'

const addAdminScope = addScope([`+${config.get('azureAdminGroupId')}`])

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
        ].map(addAdminScope)
      )
    }
  }
}
export { adminUsers }
