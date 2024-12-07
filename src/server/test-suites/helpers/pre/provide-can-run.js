const provideCanRun = {
  /**
   * Check if the user can run the test suite
   * @param {import('@hapi/hapi').Request} request
   * @returns {Promise<boolean>}
   */
  method: async function (request) {
    const authedUser = await request.getUserSession()

    if (authedUser?.isAuthenticated) {
      const { isAdmin } = authedUser

      if (isAdmin) {
        return true
      }

      const isServiceOwner = await request.userIsMemberOfATeam(
        request.pre.testSuite.teams.map((team) => team.teamId)
      )

      if (isServiceOwner) {
        return true
      }
    }

    return false
  },
  assign: 'canRun'
}

export { provideCanRun }
