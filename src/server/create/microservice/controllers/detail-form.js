import Joi from 'joi'
import Boom from '@hapi/boom'

import { buildOptions } from '~/src/server/common/helpers/options/build-options.js'
import { getUsersTeams } from '~/src/server/common/helpers/user/get-users-teams.js'
import { fetchServiceTypes } from '~/src/server/create/microservice/helpers/fetch/fetch-service-types.js'
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
    const authedUser = await request.getUserSession()

    const { serviceTypes } = await fetchServiceTypes()
    const serviceTypesOptions = buildOptions(serviceTypes)

    const usersTeams = await getUsersTeams(request)
    const teamsOptions = buildOptions(
      usersTeams.map((team) => ({
        text: team.name,
        value: team.teamId
      }))
    )

    return h.view('create/microservice/views/detail-form', {
      pageTitle: 'Create a new microservice',
      heading: 'Create a new microservice',
      serviceTypesOptions,
      teamsOptions,
      formButtonText: query?.redirectLocation ? 'Save' : 'Next',
      redirectLocation: query?.redirectLocation,
      showTemplateTag: authedUser.isAdmin
    })
  }
}

export { microserviceDetailFormController }
