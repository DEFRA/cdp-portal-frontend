import { userController } from '~/src/server/admin/users/controllers/user'
import { usersListController } from '~/src/server/admin/users/controllers/users-list'
import { startCreateUserController } from '~/src/server/admin/users/controllers/form/start-create-user'
import { findAadUserFormController } from '~/src/server/admin/users/controllers/form/find-aad-user-form'
import { findAadUserController } from '~/src/server/admin/users/controllers/form/find-aad-user'
import { findGithubUserFormController } from '~/src/server/admin/users/controllers/form/find-github-user-form'
import { findGithubUserController } from '~/src/server/admin/users/controllers/form/find-github-user'
import { userDetailsController } from '~/src/server/admin/users/controllers/form/user-details'
import { userDetailsFormController } from '~/src/server/admin/users/controllers/form/user-details-form'
import { userSummaryController } from '~/src/server/admin/users/controllers/form/user-summary'
import { createUserController } from '~/src/server/admin/users/controllers/form/create-user'
import { startEditUserController } from '~/src/server/admin/users/controllers/form/start-edit-user'
import { editUserController } from '~/src/server/admin/users/controllers/form/edit-user'

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
  editUserController
}
