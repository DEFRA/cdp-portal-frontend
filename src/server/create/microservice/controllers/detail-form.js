import Joi from 'joi'
import Boom from '@hapi/boom'

import { buildOptions } from '~/src/server/common/helpers/options/build-options.js'
import { getUsersTeams } from '~/src/server/common/helpers/user/get-users-teams.js'
import { serviceTemplateIdsForNamesAndRepos } from '~/src/server/create/microservice/helpers/fetch/fetch-service-templates.js'
import { noSessionRedirect } from '~/src/server/create/helpers/ext/no-session-redirect.js'

const microserviceDetailFormController = {
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

    const serviceTemplateIds = await serviceTemplateIdsForNamesAndRepos(request)
    const serviceTemplateIdOptions = buildOptions(serviceTemplateIds)

    const usersTeams = await getUsersTeams(request)
    const teamsOptions = buildOptions(
      usersTeams.map((team) => ({
        text: team.name,
        value: team.teamId
      }))
    )

    return h.view('create/microservice/views/detail-form', {
      pageTitle: 'Create a new microservice',
      serviceTemplateIdOptions,
      teamsOptions,
      formButtonText: query?.redirectLocation ? 'Save' : 'Next',
      redirectLocation: query?.redirectLocation
    })
  }
}

export { microserviceDetailFormController }
