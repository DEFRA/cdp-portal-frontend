import { scopes } from '~/src/server/common/constants/scopes.js'
import { authScope } from '~/src/server/common/helpers/auth/auth-scope.js'
import { provideSubNavigation } from '~/src/server/admin/helpers/provide-sub-navigation.js'
import { provideFormContextValues } from '~/src/server/common/helpers/form/provide-form-context-values.js'
import { permissionsListController } from '~/src/server/admin/permissions/controllers/permissions-list.js'
import { permissionController } from '~/src/server/admin/permissions/controllers/permission.js'
import { addPermissionController } from '~/src/server/admin/permissions/controllers/add/add-permission.js'
import { addPermissionFormController } from '~/src/server/admin/permissions/controllers/add/add-permission-form.js'
import { createPermissionDetailsController } from '~/src/server/admin/permissions/controllers/create/permission-details.js'
import { createPermissionDetailsFormController } from '~/src/server/admin/permissions/controllers/create/permission-details-form.js'
import { editPermissionDetailsController } from '~/src/server/admin/permissions/controllers/edit/permission-details.js'
import { editPermissionDetailsFormController } from '~/src/server/admin/permissions/controllers/edit/permission-details-form.js'
import { confirmRemovePermissionFromTeamController } from '~/src/server/admin/permissions/controllers/remove/team/confirm-remove-permission.js'
import { removePermissionFromTeamController } from '~/src/server/admin/permissions/controllers/remove/team/remove-permission.js'
import { confirmDeletePermissionController } from '~/src/server/admin/permissions/controllers/delete/confirm-delete-permission.js'
import { deletePermissionController } from '~/src/server/admin/permissions/controllers/delete/delete-permission.js'
import { confirmRemovePermissionFromUserController } from '~/src/server/admin/permissions/controllers/remove/user/confirm-remove-permission.js'
import { removePermissionFromUserController } from '~/src/server/admin/permissions/controllers/remove/user/remove-permission.js'

const adminScope = authScope([`+${scopes.admin}`])

const adminPermissions = {
  plugin: {
    name: 'adminPermissions',
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
            path: '/admin/permissions/create',
            ...createPermissionDetailsFormController
          },
          {
            method: 'POST',
            path: '/admin/permissions/create',
            ...createPermissionDetailsController
          },
          {
            method: 'GET',
            path: '/admin/permissions/{scopeId}/edit',
            ...editPermissionDetailsFormController
          },
          {
            method: 'POST',
            path: '/admin/permissions/{scopeId}/edit',
            ...editPermissionDetailsController
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
            path: '/admin/permissions/{scopeId}/confirm-delete',
            ...confirmDeletePermissionController
          },
          {
            method: 'POST',
            path: '/admin/permissions/{scopeId}/delete',
            ...deletePermissionController
          }
        ].map(adminScope)
      )
    }
  }
}

export { adminPermissions }
