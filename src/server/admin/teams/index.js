// import { config } from '~/src/config'
// import { addScope } from '~/src/server/common/helpers/auth/add-scope'
import { provideSubNav } from '~/src/server/admin/helpers/provide-sub-nav'
import {
  provideTeamSteps,
  provideFormContextValues
} from '~/src/server/admin/teams/helpers/form'
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
  addUserFormController,
  addUserController,
  removeUserController,
  teamSummaryController,
  editTeamController
} from '~/src/server/admin/teams/controllers'

// const addAdminScope = addScope([`+${config.get('azureAdminGroupId')}`])

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
          method: provideFormContextValues,
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
            path: '/admin/teams/edit/{teamId}',
            ...startEditTeamController
          },
          {
            method: 'GET',
            path: '/admin/teams/{teamId}/add-user',
            ...addUserFormController
          },
          {
            method: 'POST',
            path: '/admin/teams/{teamId}/add-user',
            ...addUserController
          },
          {
            method: 'POST',
            path: '/admin/teams/{teamId}/remove-user/{userId}',
            ...removeUserController
          },
          {
            method: 'GET',
            path: '/admin/teams/{teamId}',
            ...teamController
          }
        ]
        // ].map(addAdminScope)
      )
    }
  }
}

export { adminTeams }
