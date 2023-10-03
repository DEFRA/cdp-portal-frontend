import { teamController } from '~/src/server/admin/teams/controllers/team'
import { teamsListController } from '~/src/server/admin/teams/controllers/teams-list'
import { addUserFormController } from '~/src/server/admin/teams/controllers/add-user-form'
import { addUserController } from '~/src/server/admin/teams/controllers/add-user'
import { removeUserController } from '~/src/server/admin/teams/controllers/remove-user'
import { editTeamController } from '~/src/server/admin/teams/controllers/form/edit-team'
import { teamDetailsController } from '~/src/server/admin/teams/controllers/form/team-details'
import { teamDetailsFormController } from '~/src/server/admin/teams/controllers/form/team-details-form'
import { startCreateTeamController } from '~/src/server/admin/teams/controllers/form/start-create-team'
import { findGithubTeamController } from '~/src/server/admin/teams/controllers/form/find-github-team'
import { findGithubTeamFormController } from '~/src/server/admin/teams/controllers/form/find-github-team-form'
import { teamSummaryController } from '~/src/server/admin/teams/controllers/form/team-summary'
import { createTeamController } from '~/src/server/admin/teams/controllers/form/create-team'
import { startEditTeamController } from '~/src/server/admin/teams/controllers/form/start-edit-team'

export {
  startCreateTeamController,
  createTeamController,
  findGithubTeamController,
  findGithubTeamFormController,
  teamDetailsController,
  teamDetailsFormController,
  teamController,
  teamsListController,
  editTeamController,
  addUserFormController,
  addUserController,
  removeUserController,
  teamSummaryController,
  startEditTeamController
}
