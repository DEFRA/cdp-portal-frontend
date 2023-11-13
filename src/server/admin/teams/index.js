import { authScope } from '~/src/server/common/helpers/auth/auth-scope'
import { provideSubNav } from '~/src/server/admin/helpers/provide-sub-nav'
import { provideTeamSteps } from '~/src/server/admin/teams/helpers/form'
import { provideFormContextValues } from '~/src/server/common/helpers/form/provide-form-context-values'
import { sessionNames } from '~/src/server/common/constants/session-names'
import {
  startCreateTeamController,
  createTeamController,
  findGithubTeamController,
  findGithubTeamFormController,
  teamDetailsController,
  teamDetailsFormController,
  startEditTeamController,
  teamsListController,
  teamController,
  addMemberFormController,
  addMemberController,
  removeMemberController,
  teamSummaryController,
  editTeamController
} from '~/src/server/admin/teams/controllers'
import { scopes } from '~/src/server/common/constants/scopes'

const adminScope = authScope([`+${scopes.admin}`])

const adminTeams = {
  plugin: {
    name: 'adminTeams',
    register: (server) => {
      server.ext([
        {
          type: 'onPostHandler',
          method: provideSubNav,
          options: {
            sandbox: 'plugin'
          }
        },
        {
          type: 'onPostHandler',
          method: provideFormContextValues(sessionNames.cdpTeam),
          options: {
            before: ['yar'],
            sandbox: 'plugin'
          }
        },
        {
          type: 'onPostHandler',
          method: provideTeamSteps,
          options: {
            sandbox: 'plugin'
          }
        }
      ])

      server.route(
        [
          {
            method: 'GET',
            path: '/admin/teams',
            ...teamsListController
          },
          {
            method: 'GET',
            path: '/admin/teams/create',
            ...startCreateTeamController
          },
          {
            method: 'POST',
            path: '/admin/teams/create',
            ...createTeamController
          },
          {
            method: 'GET',
            path: '/admin/teams/find-github-team',
            ...findGithubTeamFormController
          },
          {
            method: 'POST',
            path: '/admin/teams/find-github-team',
            ...findGithubTeamController
          },
          {
            method: 'GET',
            path: '/admin/teams/team-details',
            ...teamDetailsFormController
          },
          {
            method: 'POST',
            path: '/admin/teams/team-details',
            ...teamDetailsController
          },
          {
            method: 'GET',
            path: '/admin/teams/summary',
            ...teamSummaryController
          },
          {
            method: 'POST',
            path: '/admin/teams/edit',
            ...editTeamController
          },
          {
            method: 'GET',
            path: '/admin/teams/{teamId}/edit',
            ...startEditTeamController
          },
          {
            method: 'GET',
            path: '/admin/teams/{teamId}/add-member',
            ...addMemberFormController
          },
          {
            method: 'POST',
            path: '/admin/teams/{teamId}/add-member',
            ...addMemberController
          },
          {
            method: 'POST',
            path: '/admin/teams/{teamId}/remove-member/{userId}',
            ...removeMemberController
          },
          {
            method: 'GET',
            path: '/admin/teams/{teamId}',
            ...teamController
          }
        ].map(adminScope)
      )
    }
  }
}

export { adminTeams }
