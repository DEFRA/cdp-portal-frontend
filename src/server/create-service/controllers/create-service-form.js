import { fetchTeams } from '~/src/server/teams/helpers/fetch-teams'
import { buildSelectOptions } from '~/src/common/helpers/build-select-options'
import { fetchServiceTypes } from '~/src/server/create-service/helpers/fetch-service-types'

const createServiceFormController = {
  handler: async (request, h) => {
    const { serviceTypes } = await fetchServiceTypes()
    const serviceTypesOptions = buildSelectOptions(serviceTypes)

    const { teams } = await fetchTeams()
    const teamsOptions = buildSelectOptions(
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
