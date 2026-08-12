import Joi from 'joi'
import Boom from '@hapi/boom'

import fetchAllGithubTeams, {
  fetchCdpTeam
} from '#server/admin/teams/helpers/fetch/fetchers.js'
import { teamIdValidation } from '@defra/cdp-validation-kit'
import { sessionNames } from '#server/common/constants/session-names.js'
import { getEnvironments } from '#server/common/helpers/environments/get-environments.js'
import { formatText } from '#config/nunjucks/filters/filters.js'
import { buildOptions } from '#server/common/helpers/options/build-options.js'

const editTeamFormController = {
  options: {
    validate: {
      params: Joi.object({
        teamId: teamIdValidation
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const teamId = request.params?.teamId

    request.yar.clear(sessionNames.validationFailure)
    const cdpTeam = await fetchCdpTeam(request.params?.teamId)
    cdpTeam.serviceCode = (cdpTeam.serviceCodes ?? [])[0]

    const alertEnvironmentsCheckboxes = getEnvironments(
      request.auth.credentials?.scope
    ).map((env) => {
      return {
        value: env,
        text: formatText(env),
        checked: cdpTeam.alertEnvironments?.includes(env) === true
      }
    })

    const searchGithubTeamsResponse = await fetchAllGithubTeams()
    const githubTeams = searchGithubTeamsResponse ?? []

    return h.view('admin/teams/views/edit/team-details-form', {
      pageTitle: 'Edit Team',
      formButtonText: 'Save',
      teamId,
      formValues: cdpTeam,
      redirectLocation: `/admin/teams/${teamId}`,
      pageHeading: {
        text: 'Edit'
      },
      alertEnvironmentsCheckboxes,
      githubTeams: buildOptions(
        githubTeams.map((githubTeam) => ({
          text: `${githubTeam.name} - @${githubTeam.github}`,
          value: githubTeam.github
        })),
        true
      ),
      splitPaneBreadcrumbs: [
        {
          text: 'Admin',
          href: '/admin'
        },
        {
          text: 'Teams',
          href: '/admin/teams'
        },
        {
          text: cdpTeam.name,
          href: `/admin/teams/${teamId}`
        },
        {
          text: 'Edit'
        }
      ]
    })
  }
}

export { editTeamFormController }
