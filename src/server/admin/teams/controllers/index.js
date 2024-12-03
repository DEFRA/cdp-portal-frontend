import { teamController } from '~/src/server/admin/teams/controllers/team.js'
import { teamsListController } from '~/src/server/admin/teams/controllers/teams-list.js'
import { removeMemberController } from '~/src/server/admin/teams/controllers/remove/remove-member.js'
import { confirmRemoveMemberController } from '~/src/server/admin/teams/controllers/remove/confirm-remove-member.js'
import { addMemberController } from '~/src/server/admin/teams/controllers/add/add-member.js'
import { addMemberFormController } from '~/src/server/admin/teams/controllers/add/add-member-form.js'
import { editTeamController } from '~/src/server/admin/teams/controllers/save/edit-team.js'
import { startCreateTeamController } from '~/src/server/admin/teams/controllers/save/start-create-team.js'
import { createTeamController } from '~/src/server/admin/teams/controllers/save/create-team.js'
import { findGithubTeamController } from '~/src/server/admin/teams/controllers/save/find-github-team.js'
import { findGithubTeamFormController } from '~/src/server/admin/teams/controllers/save/find-github-team-form.js'
import { teamDetailsController } from '~/src/server/admin/teams/controllers/save/team-details.js'
import { teamDetailsFormController } from '~/src/server/admin/teams/controllers/save/team-details-form.js'
import { teamSummaryController } from '~/src/server/admin/teams/controllers/save/team-summary.js'
import { startEditTeamController } from '~/src/server/admin/teams/controllers/save/start-edit-team.js'
import { deleteTeamController } from '~/src/server/admin/teams/controllers/delete/delete-team.js'
import { confirmDeleteTeamController } from '~/src/server/admin/teams/controllers/delete/confirm-delete-team.js'

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
  addMemberFormController,
  addMemberController,
  confirmRemoveMemberController,
  removeMemberController,
  teamSummaryController,
  startEditTeamController,
  deleteTeamController,
  confirmDeleteTeamController
}
