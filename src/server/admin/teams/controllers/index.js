import { teamController } from '~/src/server/admin/teams/controllers/team'
import { teamsListController } from '~/src/server/admin/teams/controllers/teams-list'
import { createTeamController } from '~/src/server/admin/teams/controllers/create-team'
import { editTeamController } from '~/src/server/admin/teams/controllers/edit-team'
import { teamsFormController } from '~/src/server/admin/teams/controllers/teams-form'
import { addUserFormController } from '~/src/server/admin/teams/controllers/add-user-form'
import { addUserController } from '~/src/server/admin/teams/controllers/add-user'
import { removeUserController } from '~/src/server/admin/teams/controllers/remove-user'

export {
  teamController,
  teamsListController,
  createTeamController,
  editTeamController,
  teamsFormController,
  addUserFormController,
  addUserController,
  removeUserController
}
