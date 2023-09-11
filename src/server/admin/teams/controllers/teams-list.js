import { sortBy } from '~/src/server/common/helpers/sort-by'
import { fetchCdpTeams } from '~/src/server/admin/teams/helpers/fetch-cdp-teams'
import { transformCdpTeamToEntityRow } from '~/src/server/admin/teams/transformers/transform-cdp-team-to-entity-row'

const teamsListController = {
  handler: async (request, h) => {
    const auth = request?.yar?.get('auth')
    const { teams } = await fetchCdpTeams(auth)

    const entityRows = teams
      ?.sort(sortBy('name', 'asc'))
      ?.map(transformCdpTeamToEntityRow)

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
