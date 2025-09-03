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
import { grantBreakGlassFormController } from './controllers/grant/break-glass-form.js'
import { grantBreakGlassController } from './controllers/grant/break-glass.js'
import { confirmRemoveBreakGlassController } from './controllers/remove/confirm-remove-break-glass.js'
import { removeBreakGlassController } from './controllers/remove/remove-break-glass.js'

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
        ...canGrantBreakGlassRoutes
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

const canGrantBreakGlassRoutes = [
  {
    method: 'GET',
    path: '/teams/{teamId}/grant-break-glass/{userId}',
    ...grantBreakGlassFormController
  },
  {
    method: 'POST',
    path: '/teams/{teamId}/grant-break-glass/{userId}',
    ...grantBreakGlassController
  },
  {
    method: 'GET',
    path: '/teams/{teamId}/remove-break-glass/{userId}',
    ...confirmRemoveBreakGlassController
  },
  {
    method: 'POST',
    path: '/teams/{teamId}/remove-break-glass/{userId}',
    ...removeBreakGlassController
  }
]

export { teams }
