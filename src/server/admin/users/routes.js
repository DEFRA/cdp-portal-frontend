import { authScope } from '../../common/helpers/auth/auth-scope.js'
import { provideSubNavigation } from '../helpers/provide-sub-navigation.js'
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
import { scopes } from '@defra/cdp-validation-kit'
import { multistepForm } from '#server/plugins/multistep-form/multistep-form.js'
import { formSteps, urlTemplates } from './helpers/form/steps.js'

const adminScope = authScope([`+${scopes.admin}`])

const adminUsers = {
  plugin: {
    name: 'users',
    register: async (server) => {
      await server.register({
        plugin: multistepForm,
        options: {
          urlTemplates,
          formSteps,
          routes: [
            {
              method: 'GET',
              path: '/admin/users/find-aad-user/{multiStepFormId?}',
              ...findAadUserFormController
            },
            {
              method: 'POST',
              path: '/admin/users/find-aad-user/{multiStepFormId?}',
              ...findAadUserController
            },
            {
              method: 'GET',
              path: '/admin/users/find-github-user/{multiStepFormId}',
              ...findGithubUserFormController
            },
            {
              method: 'POST',
              path: '/admin/users/find-github-user/{multiStepFormId}',
              ...findGithubUserController
            },
            {
              method: 'GET',
              path: '/admin/users/summary/{multiStepFormId}',
              ...userSummaryController
            },
            {
              method: 'GET',
              path: '/admin/users/create',
              ...startCreateUserController
            },
            {
              method: 'POST',
              path: '/admin/users/create/{multiStepFormId}',
              ...createUserController
            },
            {
              method: 'POST',
              path: '/admin/users/edit/{multiStepFormId}',
              ...editUserController
            },
            {
              method: 'GET',
              path: '/admin/users/{userId}/edit',
              ...startEditUserController
            }
          ].map(adminScope)
        }
      })

      await server.ext([
        {
          type: 'onPostHandler',
          method: provideSubNavigation,
          options: {
            sandbox: 'plugin'
          }
        }
      ])

      server.route(
        [
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
