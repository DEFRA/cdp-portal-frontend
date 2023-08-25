import { sortBy } from '~/src/server/common/helpers/sort-by'
import { fetchCdpTeams } from '~/src/server/admin/teams/helpers/fetch-cdp-teams'
import { transformTeamToEntityRow } from '~/src/server/admin/teams/transformers/transform-team-to-entity-row'

const teamsListController = {
  handler: async (request, h) => {
    const { teams } = await fetchCdpTeams()

    const entityRows = teams
      ?.sort(sortBy('name', 'asc'))
      ?.map(transformTeamToEntityRow)

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
