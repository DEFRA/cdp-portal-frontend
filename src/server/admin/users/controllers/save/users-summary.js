import { fetchCdpTeams } from '#server/admin/teams/helpers/fetch/fetchers.js'

const usersSummaryController = {
  handler: async (request, h) => {
    const { usersToCreate = [], teamsToAssign = [] } = request.app.getStepData()

    const allTeams = teamsToAssign.length ? await fetchCdpTeams() : []

    const teamsById = new Map(allTeams.map((team) => [team.teamId, team]))

    const teams = teamsToAssign
      .map((teamId) => teamsById.get(teamId))
      .filter(Boolean)

    return h.view('admin/users/views/save/users-summary', {
      pageHeading: {
        text: 'Users to add'
      },
      users: usersToCreate,
      teams,
      teamsSelectedCount: teams.length,
      formButtonText: 'Create users',
      splitPaneBreadcrumbs: [
        { text: 'Admin', href: '/admin' },
        { text: 'Users', href: '/admin/users' },
        { text: 'Add users' }
      ]
    })
  }
}

export { usersSummaryController }
