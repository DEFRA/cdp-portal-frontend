import {
  createTeamController,
  editTeamController,
  teamsListController,
  teamController,
  teamsFormController,
  addUserFormController,
  addUserController,
  removeUserController
} from '~/src/server/admin/teams/controllers'
import { provideFormContextValues } from '~/src/server/admin/teams/helpers/provide-form-context-values'
import { provideSubNav } from '~/src/server/admin/helpers/provide-sub-nav'

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
        }
      ])

      server.route([
        {
          method: 'GET',
          path: '/admin/teams',
          ...teamsListController
        },
        {
          method: 'GET',
          path: '/admin/teams/create',
          ...teamsFormController
        },
        {
          method: 'POST',
          path: '/admin/teams/create',
          ...createTeamController
        },
        {
          method: 'GET',
          path: '/admin/teams/edit/{teamId}',
          ...teamsFormController
        },
        {
          method: 'POST',
          path: '/admin/teams/edit/{teamId}',
          ...editTeamController
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
      ])
    }
  }
}

export { adminTeams }
