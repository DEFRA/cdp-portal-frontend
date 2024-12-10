import Joi from 'joi'
import Boom from '@hapi/boom'

import { buildOptions } from '~/src/server/common/helpers/options/build-options.js'
import { getUsersTeams } from '~/src/server/common/helpers/user/get-users-teams.js'
import { noSessionRedirect } from '~/src/server/create/helpers/ext/no-session-redirect.js'

const testSuiteDetailFormController = {
  options: {
    ext: {
      onPreHandler: [noSessionRedirect]
    },
    validate: {
      query: Joi.object({
        redirectLocation: Joi.string().valid('summary').allow('')
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const query = request?.query
    const authedUser = await request.getUserSession()

    const usersTeams = await getUsersTeams(request)
    const teamsOptions = buildOptions(
      usersTeams.map((team) => ({
        text: team.name,
        value: team.teamId
      }))
    )

    return h.view('create/journey-test-suite/views/detail-form', {
      pageTitle: 'Create journey test suite',
      heading: 'Create journey test suite',
      teamsOptions,
      formButtonText: query?.redirectLocation ? 'Save' : 'Next',
      redirectLocation: query?.redirectLocation,
      showTemplateTag: authedUser.isAdmin
    })
  }
}

export { testSuiteDetailFormController }
