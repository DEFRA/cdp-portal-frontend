import { fetchTeams } from '~/src/app/teams/helpers/fetch-teams'
import { buildSelectOptions } from '~/src/common/helpers/build-select-options'

const createServiceFormController = {
  handler: async (request, h) => {
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
      teamsOptions
    })
  }
}

export { createServiceFormController }
