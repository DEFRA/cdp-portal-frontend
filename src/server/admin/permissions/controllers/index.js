import { permissionsListController } from '~/src/server/admin/permissions/controllers/permissions-list.js'
import { permissionController } from '~/src/server/admin/permissions/controllers/permission.js'
import { addPermissionController } from '~/src/server/admin/permissions/controllers/add/add-permission.js'
import { addPermissionFormController } from '~/src/server/admin/permissions/controllers/add/add-permission-form.js'
import { createPermissionDetailsController } from '~/src/server/admin/permissions/controllers/create/permission-details.js'
import { createPermissionDetailsFormController } from '~/src/server/admin/permissions/controllers/create/permission-details-form.js'
import { editPermissionDetailsController } from '~/src/server/admin/permissions/controllers/edit/permission-details.js'
import { editPermissionDetailsFormController } from '~/src/server/admin/permissions/controllers/edit/permission-details-form.js'
import { confirmRemovePermissionController } from '~/src/server/admin/permissions/controllers/remove/confirm-remove-permission.js'
import { removePermissionController } from '~/src/server/admin/permissions/controllers/remove/remove-permission.js'
import { confirmDeletePermissionController } from '~/src/server/admin/permissions/controllers/delete/confirm-delete-permission.js'
import { deletePermissionController } from '~/src/server/admin/permissions/controllers/delete/delete-permission.js'

export {
  permissionsListController,
  permissionController,
  createPermissionDetailsController,
  createPermissionDetailsFormController,
  editPermissionDetailsController,
  editPermissionDetailsFormController,
  addPermissionFormController,
  addPermissionController,
  confirmRemovePermissionController,
  removePermissionController,
  confirmDeletePermissionController,
  deletePermissionController
}
