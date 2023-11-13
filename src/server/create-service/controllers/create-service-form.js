import { buildOptions } from '~/src/server/common/helpers/build-options'
import { fetchServiceTypes } from '~/src/server/create-service/helpers/fetch-service-types'
import { getUsersTeams } from '~/src/server/common/helpers/user/get-users-teams'

const createServiceFormController = {
  handler: async (request, h) => {
    const { serviceTypes } = await fetchServiceTypes()
    const serviceTypesOptions = buildOptions(serviceTypes)

    const usersTeams = await getUsersTeams(request)
    const teamsOptions = buildOptions(
      usersTeams.map((team) => ({
        text: team.name,
        value: team.teamId
      }))
    )

    return h.view('create-service/views/form', {
      pageTitle: 'Create a new microservice',
      heading: 'Create a new microservice',
      serviceTypesOptions,
      teamsOptions
    })
  }
}

export { createServiceFormController }
