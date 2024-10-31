import { authScope } from '~/src/server/common/helpers/auth/auth-scope.js'
import { provideSubNavigation } from '~/src/server/admin/helpers/provide-sub-navigation.js'
import { provideTeamSteps } from '~/src/server/admin/teams/helpers/form/index.js'
import { provideFormContextValues } from '~/src/server/common/helpers/form/provide-form-context-values.js'
import { sessionNames } from '~/src/server/common/constants/session-names.js'
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
} from '~/src/server/admin/teams/controllers/index.js'
import { scopes } from '~/src/server/common/constants/scopes.js'
import { deleteTeamController } from '~/src/server/admin/teams/controllers/delete/delete-team.js'
import { confirmDeleteTeamController } from '~/src/server/admin/teams/controllers/delete/confirm-delete-team.js'

const adminScope = authScope([`+${scopes.admin}`])

const adminTeams = {
  plugin: {
    name: 'adminTeams',
    register: (server) => {
      server.ext([
        {
          type: 'onPostHandler',
          method: provideSubNavigation,
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
            path: '/admin/teams/{teamId}/confirm-delete',
            ...confirmDeleteTeamController
          },
          {
            method: 'POST',
            path: '/admin/teams/{teamId}/delete',
            ...deleteTeamController
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
