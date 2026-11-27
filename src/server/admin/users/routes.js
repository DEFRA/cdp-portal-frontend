import { authScope } from '../../common/helpers/auth/auth-scope.js'
import { provideSubNavigation } from '../helpers/provide-sub-navigation.js'
import { userController } from './controllers/user.js'
import { usersListController } from './controllers/users-list.js'
import { confirmDeleteUserController } from './controllers/delete/confirm-delete-user.js'
import { deleteUserController } from './controllers/delete/delete-user.js'
import { confirmDisableUserController } from './controllers/disable/confirm-disable-user.js'
import { disableUserController } from './controllers/disable/disable-user.js'
import { enableUserController } from './controllers/enable/enable-user.js'
import { editUserController } from './controllers/edit/edit-user.js'
import { startCreateUserController } from './controllers/save/start-create-user.js'
import { createUsersController } from './controllers/save/create-users.js'
import { startEditUserController } from './controllers/edit/edit-user-form.js'
import { scopes } from '@defra/cdp-validation-kit'
import { multistepForm } from '#server/plugins/multistep-form/multistep-form.js'
import { formSteps, urlTemplates } from './helpers/form/steps.js'
import { sessionNames } from '#server/common/constants/session-names.js'
import { addUserFormController } from '#server/admin/users/controllers/save/add-user-form.js'
import { addUserController } from '#server/admin/users/controllers/save/add-user.js'
import { usersSummaryController } from '#server/admin/users/controllers/save/users-summary.js'
import { removeUserController } from '#server/admin/users/controllers/save/remove-user.js'
import { addTeamsController } from '#server/admin/users/controllers/save/add-teams.js'
import { addTeamsFormController } from '#server/admin/users/controllers/save/add-teams-form.js'
import { removeTeamController } from '#server/admin/users/controllers/save/remove-teams.js'

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
          sessionName: sessionNames.cdpUser,
          urlTemplates,
          formSteps,
          ext: serverExtensions,
          routes: [
            {
              method: 'GET',
              path: '/admin/users/add',
              ...addUserFormController
            },
            {
              method: 'POST',
              path: '/admin/users/add',
              ...addUserController
            },

            {
              method: 'GET',
              path: '/admin/users/summary',
              ...usersSummaryController
            },
            {
              method: 'POST',
              path: '/admin/users/remove',
              ...removeUserController
            },
            {
              method: 'GET',
              path: '/admin/users/teams',
              ...addTeamsFormController
            },
            {
              method: 'POST',
              path: '/admin/users/teams',
              ...addTeamsController
            },
            {
              method: 'POST',
              path: '/admin/users/remove-team',
              ...removeTeamController
            },
            {
              method: 'GET',
              path: '/admin/users/create',
              ...startCreateUserController
            },
            {
              method: 'POST',
              path: '/admin/users/create',
              ...createUsersController
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
            path: '/admin/users/{userId}/confirm-disable',
            ...confirmDisableUserController
          },
          {
            method: 'POST',
            path: '/admin/users/{userId}/disable',
            ...disableUserController
          },
          {
            method: 'POST',
            path: '/admin/users/{userId}/enable',
            ...enableUserController
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
