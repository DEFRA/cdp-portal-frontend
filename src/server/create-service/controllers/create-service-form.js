import { fetchTeams } from '~/src/server/teams/helpers/fetch-teams'
import { buildOptions } from '~/src/common/helpers/build-options'
import { fetchServiceTypes } from '~/src/server/create-service/helpers/fetch-service-types'

const createServiceFormController = {
  handler: async (request, h) => {
    const { serviceTypes } = await fetchServiceTypes()
    const serviceTypesOptions = buildOptions(serviceTypes)

    const { teams } = await fetchTeams()
    const teamsOptions = buildOptions(
      teams.map((team) => ({
        text: team.name,
        value: team.id
      }))
    )

    return h.view('create-service/views/form', {
      pageTitle: 'Create a new micro-service',
      heading: 'Create a new micro-service',
      serviceTypesOptions,
      teamsOptions
    })
  }
}

export { createServiceFormController }
