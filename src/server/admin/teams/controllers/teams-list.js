import { fetchCdpTeams } from '~/src/server/admin/teams/helpers/fetch-cdp-teams'
import { transformCdpTeamToEntityRow } from '~/src/server/admin/teams/transformers/transform-cdp-team-to-entity-row'

const teamsListController = {
  handler: async (request, h) => {
    const authedUser = await request.getUserSession()

    const token = authedUser?.token ?? null
    const { teams } = await fetchCdpTeams(token)

    const entityRows = teams?.map(transformCdpTeamToEntityRow)

    return h.view('admin/teams/views/teams-list', {
      pageTitle: 'Teams',
      heading: 'Teams',
      entityRows,
      headingCaption: 'CDP - Portal teams',
      noResult: 'Currently there are no teams'
    })
  }
}

export { teamsListController }
