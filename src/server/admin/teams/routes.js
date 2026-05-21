import { scopes } from '@defra/cdp-validation-kit'
import { authScope } from '../../common/helpers/auth/auth-scope.js'

import { provideSubNavigation } from '../helpers/provide-sub-navigation.js'
import { teamController } from './controllers/team.js'
import { teamsListController } from './controllers/teams-list.js'
import { removeMemberController } from './controllers/remove/remove-member.js'
import { confirmRemoveMemberController } from './controllers/remove/confirm-remove-member.js'
import { addMemberController } from './controllers/add/add-member.js'
import { addMemberFormController } from './controllers/add/add-member-form.js'
import { editTeamController } from './controllers/save/edit-team.js'
import { startCreateTeamController } from './controllers/save/start-create-team.js'
import { createTeamController } from './controllers/save/create-team.js'
import { findGithubTeamController } from './controllers/save/find-github-team.js'
import { findGithubTeamFormController } from './controllers/save/find-github-team-form.js'
import { teamDetailsController } from './controllers/save/team-details.js'
import { teamDetailsFormController } from './controllers/save/team-details-form.js'
import { teamSummaryController } from './controllers/save/team-summary.js'
import { startEditTeamController } from './controllers/save/start-edit-team.js'
import { deleteTeamController } from './controllers/delete/delete-team.js'
import { confirmDeleteTeamController } from './controllers/delete/confirm-delete-team.js'

import { multistepForm } from '#server/plugins/multistep-form/multistep-form.js'
import { formSteps, urlTemplates } from './helpers/form/steps.js'
import teamDetailsForm from './helpers/form/team-details-form.js'

const adminScope = authScope([`+${scopes.admin}`])

const serverExtensions = [
  {
    type: 'onPostHandler',
    method: provideSubNavigation,
    options: {
      sandbox: 'plugin'
    }
  }
]

const adminTeams = {
  plugin: {
    name: 'adminTeams',
    register: async (server) => {
      await server.ext(serverExtensions)

      await server.register({
        plugin: multistepForm,
        options: {
          urlTemplates,
          formSteps,
          ext: serverExtensions,
          routes: [
            {
              method: 'GET',
              path: '/admin/teams/team-details/{multiStepFormId?}',
              ...teamDetailsFormController
            },
            {
              method: 'POST',
              path: '/admin/teams/team-details/{multiStepFormId?}',
              ...teamDetailsController
            },
            {
              method: 'POST',
              path: '/admin/teams/create/{multiStepFormId}',
              ...createTeamController
            },
            {
              method: 'GET',
              path: '/admin/teams/find-github-team/{multiStepFormId}',
              ...findGithubTeamFormController
            },
            {
              method: 'POST',
              path: '/admin/teams/find-github-team/{multiStepFormId}',
              ...findGithubTeamController
            },
            {
              method: 'GET',
              path: '/admin/teams/summary/{multiStepFormId}',
              ...teamSummaryController
            }
          ].map(adminScope)
        }
      })

      await server.register(teamDetailsForm(serverExtensions))

      server.route(
        [
          {
            method: 'GET',
            path: '/admin/teams',
            ...teamsListController
          },
          {
            method: 'POST',
            path: '/admin/teams/edit',
            ...editTeamController
          },
          {
            method: 'GET',
            path: '/admin/teams/create/{multiStepFormId}',
            ...startCreateTeamController
          },
          // {
          //   method: 'GET',
          //   path: '/admin/teams/{teamId}/edit',
          //   ...startEditTeamController
          // },
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
