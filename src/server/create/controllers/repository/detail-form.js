import Joi from 'joi'
import Boom from '@hapi/boom'
import { startCase } from 'lodash'

import { buildOptions } from '~/src/server/common/helpers/build-options'
import { getUsersTeams } from '~/src/server/common/helpers/user/get-users-teams'
import { noSessionRedirect } from '~/src/server/create/helpers/ext/no-session-redirect'
import { repositoryVisibility } from '~/src/server/create/constants/repository-visibility'

const repositoryDetailFormController = {
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

    return h.view('create/views/repository-detail-form', {
      pageTitle: 'Create a new repository',
      heading: 'Create a new repository',
      visibilityOptions: buildOptions(
        repositoryVisibility.map((visibility) => ({
          text: startCase(visibility),
          value: visibility
        }))
      ),
      teamsOptions,
      formButtonText: query?.redirectLocation ? 'Save' : 'Next',
      redirectLocation: query?.redirectLocation
    })
  }
}

export { repositoryDetailFormController }
