import {
  teamController,
  teamsListController,
  teamEditStartController,
  teamDetailsFormController,
  teamDetailsController,
  addMemberController,
  addMemberFormController,
  removeMemberController
} from '~/src/server/teams/controllers'
import { authScope } from '~/src/server/common/helpers/auth/auth-scope'
import { sessionNames } from '~/src/server/common/constants/session-names'
import { provideFormContextValues } from '~/src/server/common/helpers/form/provide-form-context-values'

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
