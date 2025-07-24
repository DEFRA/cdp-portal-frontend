import Joi from 'joi'
import Boom from '@hapi/boom'
import startCase from 'lodash/startCase.js'

import { buildOptions } from '../../../common/helpers/options/build-options.js'
import { getUsersTeams } from '../../../common/helpers/user/get-users-teams.js'
import { noSessionRedirect } from '../../helpers/ext/no-session-redirect.js'
import { repositoryVisibility } from '../../constants/repository-visibility.js'

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

    return h.view('create/repository/views/detail-form', {
      pageTitle: 'Create a new repository',
      visibilityOptions: buildOptions(
        repositoryVisibility.map((visibility) => ({
          text: startCase(visibility),
          value: visibility,
          ...(visibility === 'public' && { selected: true })
        })),
        false
      ),
      teamsOptions,
      formButtonText: query?.redirectLocation ? 'Save' : 'Next',
      redirectLocation: query?.redirectLocation
    })
  }
}

export { repositoryDetailFormController }
