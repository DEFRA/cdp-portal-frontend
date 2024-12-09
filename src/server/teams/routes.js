import { addMemberFormController } from '~/src/server/teams/controllers/add/member-form.js'
import { addMemberController } from '~/src/server/teams/controllers/add/member.js'
import { teamEditStartController } from '~/src/server/teams/controllers/edit/start.js'
import { teamDetailsFormController } from '~/src/server/teams/controllers/edit/team-details-form.js'
import { teamDetailsController } from '~/src/server/teams/controllers/edit/team-details.js'
import { teamController } from '~/src/server/teams/controllers/team.js'
import { teamsListController } from '~/src/server/teams/controllers/teams-list.js'
import { removeMemberController } from '~/src/server/teams/controllers/remove/member.js'
import { authScope } from '~/src/server/common/helpers/auth/auth-scope.js'
import { sessionNames } from '~/src/server/common/constants/session-names.js'
import { provideFormContextValues } from '~/src/server/common/helpers/form/provide-form-context-values.js'

const teamScope = authScope(['+{params.teamId}'])

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
            ...teamEditStartController
          },
          {
            method: 'GET',
            path: '/teams/{teamId}/team-details',
            ...teamDetailsFormController
          },
          {
            method: 'POST',
            path: '/teams/{teamId}/team-details',
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
            method: 'POST',
            path: '/teams/{teamId}/remove-member/{userId}',
            ...removeMemberController
          }
        ].map(teamScope)
      ])
    }
  }
}

export { teams }
