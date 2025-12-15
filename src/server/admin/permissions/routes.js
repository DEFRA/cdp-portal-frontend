import { scopes } from '@defra/cdp-validation-kit'

import { authScope } from '../../common/helpers/auth/auth-scope.js'
import { provideSubNavigation } from '../helpers/provide-sub-navigation.js'
import { provideFormContextValues } from '../../common/helpers/form/provide-form-context-values.js'
import { permissionsListController } from './controllers/permissions-list.js'
import { permissionController } from './controllers/permission.js'
import { addPermissionController } from './controllers/add/add-permission.js'
import { addPermissionFormController } from './controllers/add/add-permission-form.js'
import { confirmRemovePermissionFromTeamController } from './controllers/remove/team/confirm-remove-permission.js'
import { removePermissionFromTeamController } from './controllers/remove/team/remove-permission.js'
import { confirmRemovePermissionFromUserController } from './controllers/remove/user/confirm-remove-permission.js'
import { removePermissionFromUserController } from './controllers/remove/user/remove-permission.js'
import { findUserController } from './controllers/add/member/find-user.js'
import { findUserFormController } from './controllers/add/member/find-user-form.js'
import { multistepForm } from '../../common/helpers/multistep-form/multistep-form.js'
import { teamScopeFormController } from './controllers/add/member/team-scope-form.js'
import { teamScopeController } from './controllers/add/member/team-scope.js'
import { summaryController } from './controllers/add/member/summary.js'
import { addPermissionToMemberController } from './controllers/add/member/add-permission-to-member.js'
import { removePermissionFromMemberController } from './controllers/remove/member/remove-permission.js'
import { confirmRemovePermissionFromMemberController } from './controllers/remove/member/confirm-remove-permission.js'
import {
  formSteps,
  urlTemplates
} from './helpers/multistep-form/add/user/steps.js'

const adminScope = authScope([`+${scopes.admin}`])
const serverExtensions = [
  {
    type: 'onPostHandler',
    method: provideSubNavigation,
    options: { sandbox: 'plugin' }
  },
  {
    type: 'onPostHandler',
    method: provideFormContextValues(),
    options: { before: ['yar'], sandbox: 'plugin' }
  }
]

const adminPermissions = {
  plugin: {
    name: 'adminPermissions',
    register: (server) => {
      server.ext(serverExtensions)

      server.register({
        plugin: multistepForm,
        options: {
          urlTemplates,
          formSteps,
          ext: serverExtensions,
          routes: [
            {
              method: 'GET',
              path: '/admin/permissions/{scopeId}/user/find/{multiStepFormId?}',
              ...findUserFormController
            },
            {
              method: 'POST',
              path: '/admin/permissions/{scopeId}/user/find/{multiStepFormId?}',
              ...findUserController
            },
            {
              method: 'GET',
              path: '/admin/permissions/{scopeId}/user/{userId}/team-scope/{multiStepFormId}',
              ...teamScopeFormController
            },
            {
              method: 'POST',
              path: '/admin/permissions/{scopeId}/user/{userId}/team-scope/{multiStepFormId}',
              ...teamScopeController
            },
            {
              method: 'GET',
              path: '/admin/permissions/{scopeId}/user/{userId}/summary/{multiStepFormId}',
              ...summaryController
            },
            {
              method: 'POST',
              path: '/admin/permissions/{scopeId}/user/{userId}/add/{multiStepFormId}',
              ...addPermissionToMemberController
            }
          ].map(adminScope)
        }
      })

      server.route(
        [
          {
            method: 'GET',
            path: '/admin/permissions',
            ...permissionsListController
          },
          {
            method: 'GET',
            path: '/admin/permissions/{scopeId}',
            ...permissionController
          },
          {
            method: 'GET',
            path: '/admin/permissions/{scopeId}/add',
            ...addPermissionFormController
          },
          {
            method: 'POST',
            path: '/admin/permissions/{scopeId}/add',
            ...addPermissionController
          },
          {
            method: 'GET',
            path: '/admin/permissions/{scopeId}/team/remove/{teamId}',
            ...confirmRemovePermissionFromTeamController
          },
          {
            method: 'POST',
            path: '/admin/permissions/{scopeId}/team/remove/{teamId}',
            ...removePermissionFromTeamController
          },
          {
            method: 'GET',
            path: '/admin/permissions/{scopeId}/user/remove/{userId}',
            ...confirmRemovePermissionFromUserController
          },
          {
            method: 'POST',
            path: '/admin/permissions/{scopeId}/user/remove/{userId}',
            ...removePermissionFromUserController
          },
          {
            method: 'GET',
            path: '/admin/permissions/{scopeId}/member/remove/{userId}/team/{teamId}',
            ...confirmRemovePermissionFromMemberController
          },
          {
            method: 'POST',
            path: '/admin/permissions/{scopeId}/member/remove/{userId}/team/{teamId}',
            ...removePermissionFromMemberController
          }
        ].map(adminScope)
      )
    }
  }
}

export { adminPermissions }
