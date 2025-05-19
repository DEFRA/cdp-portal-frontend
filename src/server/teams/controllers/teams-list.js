import { fetchTeams } from '~/src/server/teams/helpers/fetch/fetch-teams.js'
import { teamToEntityRow } from '~/src/server/teams/transformers/team-to-entity-row.js'
import { provideAuthedUser } from '~/src/server/common/helpers/auth/pre/provide-authed-user.js'

function belongsToTeam(userScopeUUIDs) {
  return (team) => ({
    isMemberOfTeam: userScopeUUIDs.includes(team.teamId),
    ...team
  })
}

function sortByTeam(a, b) {
  if (a.isMemberOfTeam && !b.isMemberOfTeam) {
    return -1
  }
  if (!a.isMemberOfTeam && b.isMemberOfTeam) {
    return 1
  }

  return a.name.localeCompare(b.name)
}

const teamsListController = {
  options: {
    id: 'teams',
    pre: [provideAuthedUser]
  },
  handler: async (request, h) => {
    const authedUser = request.pre.authedUser
    const userScopeUUIDs = authedUser?.uuidScope ?? []

    const { teams } = await fetchTeams()

    const teamDecorator = belongsToTeam(userScopeUUIDs)
    const rows =
      teams?.map(teamDecorator).toSorted(sortByTeam).map(teamToEntityRow) ?? []

    return h.view('teams/views/list', {
      pageTitle: 'Teams',
      tableData: {
        headers: [
          { id: 'member', classes: 'app-entity-table__cell--owned' },
          { id: 'name', text: 'Name', width: '15', isLeftAligned: true },
          { id: 'github-team', text: 'GitHub Team', width: '15' },
          { id: 'user-count', text: 'Members', width: '5' },
          { id: 'updated', text: 'Last Updated', width: '30' },
          { id: 'created', text: 'Created', width: '35' }
        ],
        rows,
        noResult: 'No running services found',
        isWide: true
      }
    })
  }
}

export { teamsListController }
