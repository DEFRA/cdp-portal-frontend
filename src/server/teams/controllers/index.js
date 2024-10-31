import { teamController } from '~/src/server/teams/controllers/team.js'
import { teamsListController } from '~/src/server/teams/controllers/teams-list.js'
import {
  teamEditStartController,
  teamDetailsFormController,
  teamDetailsController
} from '~/src/server/teams/controllers/edit/index.js'
import { removeMemberController } from '~/src/server/teams/controllers/remove/member.js'
import {
  addMemberController,
  addMemberFormController
} from '~/src/server/teams/controllers/add/index.js'

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
