import { teamController } from '~/src/server/admin/teams/controllers/team.js'
import { teamsListController } from '~/src/server/admin/teams/controllers/teams-list.js'
import { removeMemberController } from '~/src/server/admin/teams/controllers/remove/remove-member.js'
import {
  addMemberFormController,
  addMemberController
} from '~/src/server/admin/teams/controllers/add/index.js'
import {
  editTeamController,
  teamDetailsController,
  teamDetailsFormController,
  startCreateTeamController,
  findGithubTeamController,
  findGithubTeamFormController,
  teamSummaryController,
  createTeamController,
  startEditTeamController
} from '~/src/server/admin/teams/controllers/save/index.js'

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
  removeMemberController,
  teamSummaryController,
  startEditTeamController
}
