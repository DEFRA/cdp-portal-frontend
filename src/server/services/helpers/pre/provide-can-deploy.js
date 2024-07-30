const provideCanDeploy = {
  method: async function (request) {
    const authedUser = await request.getUserSession()

    if (authedUser?.isAuthenticated) {
      const { isAdmin } = authedUser

      if (isAdmin) {
        return true
      }

      const isServiceOwner = await request.userIsMemberOfATeam(
        request.pre.service.teams.map((team) => team.teamId)
      )

      if (isServiceOwner) {
        return true
      }
    }

    return false
  },
  assign: 'canDeploy'
}

export { provideCanDeploy }
