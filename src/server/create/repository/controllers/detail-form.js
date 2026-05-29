import startCase from 'lodash/startCase.js'

import { buildOptions } from '../../../common/helpers/options/build-options.js'
import { getUsersTeams } from '../../../common/helpers/user/get-users-teams.js'
import { repositoryVisibility } from '../../constants/repository-visibility.js'

const repositoryDetailFormController = {
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
