import { sortBy } from '~/src/server/common/helpers/sort-by'
import { fetchAdminTeams } from '~/src/server/admin/teams/helpers/fetch-admin-teams'
import { transformTeamToEntityRow } from '~/src/server/admin/teams/transformers/transform-team-to-entity-row'

const teamsListController = {
  handler: async (request, h) => {
    const { teams } = await fetchAdminTeams()

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
