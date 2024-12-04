import { userController } from '~/src/server/admin/users/controllers/user.js'
import { usersListController } from '~/src/server/admin/users/controllers/users-list.js'
import { confirmDeleteUserController } from '~/src/server/admin/users/controllers/delete/confirm-delete-user.js'
import { deleteUserController } from '~/src/server/admin/users/controllers/delete/delete-user.js'
import { editUserController } from '~/src/server/admin/users/controllers/save/edit-user.js'
import { startCreateUserController } from '~/src/server/admin/users/controllers/save/start-create-user.js'
import { findAadUserFormController } from '~/src/server/admin/users/controllers/save/find-aad-user-form.js'
import { findAadUserController } from '~/src/server/admin/users/controllers/save/find-aad-user.js'
import { findGithubUserFormController } from '~/src/server/admin/users/controllers/save/find-github-user-form.js'
import { findGithubUserController } from '~/src/server/admin/users/controllers/save/find-github-user.js'
import { userDetailsController } from '~/src/server/admin/users/controllers/save/user-details.js'
import { userDetailsFormController } from '~/src/server/admin/users/controllers/save/user-details-form.js'
import { userSummaryController } from '~/src/server/admin/users/controllers/save/user-summary.js'
import { createUserController } from '~/src/server/admin/users/controllers/save/create-user.js'
import { startEditUserController } from '~/src/server/admin/users/controllers/save/start-edit-user.js'

export {
  userController,
  usersListController,
  startCreateUserController,
  findAadUserFormController,
  findAadUserController,
  findGithubUserFormController,
  findGithubUserController,
  userDetailsController,
  userDetailsFormController,
  userSummaryController,
  createUserController,
  startEditUserController,
  editUserController,
  confirmDeleteUserController,
  deleteUserController
}
