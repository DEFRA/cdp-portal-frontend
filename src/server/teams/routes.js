import { addMemberFormController } from '~/src/server/teams/controllers/add/add-member-form.js'
import { addMemberController } from '~/src/server/teams/controllers/add/add-member.js'
import { teamDetailsFormController } from '~/src/server/teams/controllers/edit/team-details-form.js'
import { teamDetailsController } from '~/src/server/teams/controllers/edit/team-details.js'
import { teamController } from '~/src/server/teams/controllers/team.js'
import { teamsListController } from '~/src/server/teams/controllers/teams-list.js'
import { authScope } from '~/src/server/common/helpers/auth/auth-scope.js'
import { sessionNames } from '~/src/server/common/constants/session-names.js'
import { provideFormContextValues } from '~/src/server/common/helpers/form/provide-form-context-values.js'
import { removeMemberController } from '~/src/server/teams/controllers/remove/remove-member.js'
import { confirmRemoveMemberController } from '~/src/server/teams/controllers/remove/confirm-remove-member.js'
import { scopes } from '~/src/server/common/constants/scopes.js'

const teamOrAdminScope = authScope([scopes.admin, '{params.teamId}'])

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
        ...[
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
        ].map(teamOrAdminScope)
      ])
    }
  }
}

export { teams }
