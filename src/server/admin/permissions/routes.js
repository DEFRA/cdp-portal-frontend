import { authScope } from '~/src/server/common/helpers/auth/auth-scope.js'
import { provideSubNavigation } from '~/src/server/admin/helpers/provide-sub-navigation.js'
import { provideFormContextValues } from '~/src/server/common/helpers/form/provide-form-context-values.js'
import { scopes } from '~/src/server/common/constants/scopes.js'
import {
  permissionsListController,
  permissionController,
  createPermissionDetailsController,
  createPermissionDetailsFormController,
  editPermissionDetailsController,
  editPermissionDetailsFormController,
  addPermissionController,
  addPermissionFormController,
  confirmRemovePermissionController,
  removePermissionController,
  confirmDeletePermissionController,
  deletePermissionController
} from '~/src/server/admin/permissions/controllers/index.js'

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
            path: '/admin/permissions/{scopeId}/remove/{teamId}',
            ...confirmRemovePermissionController
          },
          {
            method: 'POST',
            path: '/admin/permissions/{scopeId}/remove/{teamId}',
            ...removePermissionController
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
