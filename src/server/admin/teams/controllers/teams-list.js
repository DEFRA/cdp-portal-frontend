import { sortBy } from '~/src/server/common/helpers/sort-by'
import { fetchCdpTeams } from '~/src/server/admin/teams/helpers/fetch-cdp-teams'
import { transformCdpTeamToEntityRow } from '~/src/server/admin/teams/transformers/transform-cdp-team-to-entity-row'
import { sessionNames } from '~/src/server/common/constants/session-names'

const teamsListController = {
  handler: async (request, h) => {
    const user = request.yar.get(sessionNames.user)
    const token = user?.token ?? null
    const { teams } = await fetchCdpTeams(token)

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
