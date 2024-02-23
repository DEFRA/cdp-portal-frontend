import Joi from 'joi'
import Boom from '@hapi/boom'

import { buildOptions } from '~/src/server/common/helpers/options/build-options'
import { getUsersTeams } from '~/src/server/common/helpers/user/get-users-teams'
import { noSessionRedirect } from '~/src/server/create/helpers/ext/no-session-redirect'

const envTestSuiteDetailFormController = {
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

    const usersTeams = await getUsersTeams(request)
    const teamsOptions = buildOptions(
      usersTeams.map((team) => ({
        text: team.name,
        value: team.teamId
      }))
    )

    return h.view('create/env-test-suite/views/detail-form', {
      pageTitle: 'Create environment test suite',
      heading: 'Create environment test suite',
      teamsOptions,
      formButtonText: query?.redirectLocation ? 'Save' : 'Next',
      redirectLocation: query?.redirectLocation
    })
  }
}

export { envTestSuiteDetailFormController }
