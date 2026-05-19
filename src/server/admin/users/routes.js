import { authScope } from '../../common/helpers/auth/auth-scope.js'
import { provideSubNavigation } from '../helpers/provide-sub-navigation.js'
import { userController } from './controllers/user.js'
import { usersListController } from './controllers/users-list.js'
import { confirmDeleteUserController } from './controllers/delete/confirm-delete-user.js'
import { deleteUserController } from './controllers/delete/delete-user.js'
import { editUserController } from './controllers/edit/edit-user.js'
import { startCreateUserController } from './controllers/save/start-create-user.js'
import { findAadUserFormController } from './controllers/save/find-aad-user-form.js'
import { findAadUserController } from './controllers/save/find-aad-user.js'
import { findGithubUserFormController } from './controllers/save/find-github-user-form.js'
import { findGithubUserController } from './controllers/save/find-github-user.js'
import { userSummaryController } from './controllers/save/user-summary.js'
import { createUserController } from './controllers/save/create-user.js'
import { startEditUserController } from './controllers/edit/edit-user-form.js'
import { scopes } from '@defra/cdp-validation-kit'
import { multistepForm } from '#server/plugins/multistep-form/multistep-form.js'
import { formSteps, urlTemplates } from './helpers/form/steps.js'

const adminScope = authScope([`+${scopes.admin}`])

const serverExtensions = [
  {
    type: 'onPostHandler',
    method: provideSubNavigation,
    options: {
      sandbox: 'plugin'
    }
  }
]

const adminUsers = {
  plugin: {
    name: 'users',
    register: async (server) => {
      await server.ext(serverExtensions)

      await server.register({
        plugin: multistepForm,
        options: {
          urlTemplates,
          formSteps,
          ext: serverExtensions,
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
            }
          ].map(adminScope)
        }
      })

      server.route(
        [
          {
            method: 'GET',
            path: '/admin/users/{userId}/edit',
            ...startEditUserController
          },
          {
            method: 'POST',
            path: '/admin/users/{userId}/edit',
            ...editUserController
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
