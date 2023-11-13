import { fetchTeams } from '~/src/server/teams/helpers/fetch-teams'

async function getUsersTeams(request) {
  const authedUser = await request.getUserSession()
  const userGroups = authedUser.scope

  const { teams } = await fetchTeams(true)

  if (authedUser.isAdmin) {
    return teams
  }

  return userGroups
    .map((userGroupId) => teams.find((team) => team.teamId === userGroupId))
    .filter(Boolean)
}

export { getUsersTeams }
