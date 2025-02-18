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
    pre: [provideAuthedUser]
  },
  handler: async (request, h) => {
    const authedUser = request.pre.authedUser
    const isAuthenticated = authedUser?.isAuthenticated
    const userScopeUUIDs = authedUser?.uuidScope ?? []

    const { teams } = await fetchTeams()

    const teamDecorator = belongsToTeam(userScopeUUIDs)
    const rowBuilder = teamToEntityRow(isAuthenticated, userScopeUUIDs)
    const rows =
      teams?.map(teamDecorator).toSorted(sortByTeam).map(rowBuilder) ?? []

    return h.view('teams/views/list', {
      pageTitle: 'Teams',
      tableData: {
        headers: [
          ...(isAuthenticated
            ? [{ id: 'member', classes: 'app-entity-table__cell--owned' }]
            : []),
          { id: 'name', text: 'Name', width: '15' },
          { id: 'github-team', text: 'GitHub Team', width: '15' },
          { id: 'user-count', text: 'Members', width: '5' },
          { id: 'updated', text: 'Last Updated', width: '30' },
          { id: 'created', text: 'Created', width: '35' }
        ],
        rows,
        noResult: 'No running services found'
      }
    })
  }
}

export { teamsListController }
