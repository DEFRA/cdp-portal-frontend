import { scopes } from '@defra/cdp-validation-kit'

import { authScope } from '../../common/helpers/auth/auth-scope.js'
import { provideSubNavigation } from '../helpers/provide-sub-navigation.js'
import { provideTeamSteps } from './helpers/form/index.js'
import { provideFormContextValues } from '../../common/helpers/form/provide-form-context-values.js'
import { sessionNames } from '../../common/constants/session-names.js'
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
  confirmRemoveMemberController,
  removeMemberController,
  teamSummaryController,
  editTeamController,
  deleteTeamController,
  confirmDeleteTeamController
} from './controllers/index.js'

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
            method: 'GET',
            path: '/admin/teams/{teamId}/remove-member/{userId}',
            ...confirmRemoveMemberController
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
