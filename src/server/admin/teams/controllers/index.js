import { teamController } from '~/src/server/admin/teams/controllers/team'
import { teamsListController } from '~/src/server/admin/teams/controllers/teams-list'
import { removeMemberController } from '~/src/server/admin/teams/controllers/remove/member'
import {
  addMemberFormController,
  addMemberController
} from '~/src/server/admin/teams/controllers/add'
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
} from '~/src/server/admin/teams/controllers/save'

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
