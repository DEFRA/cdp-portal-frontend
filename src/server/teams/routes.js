import { addMemberFormController } from './controllers/add/add-member-form.js'
import { addMemberController } from './controllers/add/add-member.js'
import { teamDetailsFormController } from './controllers/edit/team-details-form.js'
import { teamDetailsController } from './controllers/edit/team-details.js'
import { teamController } from './controllers/team.js'
import { teamsListController } from './controllers/teams-list.js'
import { sessionNames } from '../common/constants/session-names.js'
import { provideFormContextValues } from '../common/helpers/form/provide-form-context-values.js'
import { removeMemberController } from './controllers/remove/remove-member.js'
import { confirmRemoveMemberController } from './controllers/remove/confirm-remove-member.js'
import { grantProdAccessFormController } from './controllers/grant/prod-access-form.js'
import { grantProdAccessController } from './controllers/grant/prod-access.js'
import { confirmRemoveProdAccessController } from './controllers/remove/confirm-remove-prod-access.js'
import { removeProdAccessController } from './controllers/remove/remove-prod-access.js'

const teams = {
  plugin: {
    name: 'teams',
    register: (server) => {
      server.ext([
        {
          type: 'onPostHandler',
          method: provideFormContextValues(sessionNames.cdpTeam),
          options: {
            before: ['yar'],
            sandbox: 'plugin'
          }
        }
      ])

      server.route([
        {
          method: 'GET',
          path: '/teams',
          ...teamsListController
        },
        {
          method: 'GET',
          path: '/teams/{teamId}',
          ...teamController
        },
        ...teamOwnerOrAdminRoutes,
        ...canGrantProdAccessRoutes
      ])
    }
  }
}

const teamOwnerOrAdminRoutes = [
  {
    method: 'GET',
    path: '/teams/{teamId}/edit',
    ...teamDetailsFormController
  },
  {
    method: 'POST',
    path: '/teams/{teamId}/edit',
    ...teamDetailsController
  },
  {
    method: 'GET',
    path: '/teams/{teamId}/add-member',
    ...addMemberFormController
  },
  {
    method: 'POST',
    path: '/teams/{teamId}/add-member',
    ...addMemberController
  },
  {
    method: 'GET',
    path: '/teams/{teamId}/remove-member/{userId}',
    ...confirmRemoveMemberController
  },
  {
    method: 'POST',
    path: '/teams/{teamId}/remove-member/{userId}',
    ...removeMemberController
  }
]

const canGrantProdAccessRoutes = [
  {
    method: 'GET',
    path: '/teams/{teamId}/grant-prod-access/{userId}',
    ...grantProdAccessFormController
  },
  {
    method: 'POST',
    path: '/teams/{teamId}/grant-prod-access/{userId}',
    ...grantProdAccessController
  },
  {
    method: 'GET',
    path: '/teams/{teamId}/remove-prod-access/{userId}',
    ...confirmRemoveProdAccessController
  },
  {
    method: 'POST',
    path: '/teams/{teamId}/remove-prod-access/{userId}',
    ...removeProdAccessController
  }
]

export { teams }
