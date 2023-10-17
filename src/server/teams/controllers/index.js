import { teamController } from '~/src/server/teams/controllers/team'
import { teamsListController } from '~/src/server/teams/controllers/teams-list'
import {
  teamEditStartController,
  teamDetailsFormController,
  teamDetailsController
} from '~/src/server/teams/controllers/edit'
import { removeMemberController } from '~/src/server/teams/controllers/remove/member'
import {
  addMemberController,
  addMemberFormController
} from '~/src/server/teams/controllers/add'

export {
  teamController,
  teamsListController,
  teamEditStartController,
  teamDetailsFormController,
  teamDetailsController,
  removeMemberController,
  addMemberController,
  addMemberFormController
}
