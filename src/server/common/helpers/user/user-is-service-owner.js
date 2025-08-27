function userIsServiceOwner(userSession) {
  return (teams) =>
    userSession &&
    teams.some((team) => userSession?.scope?.includes(`team:${team}`))
}

function userIsServiceOwnerDecorator(request) {
  /** @param {string[]} teamsForTheService */
  return async (teamsForTheService) => {
    const userSession = await request.getUserSession()

    return userIsServiceOwner(userSession)(teamsForTheService)
  }
}

export { userIsServiceOwnerDecorator, userIsServiceOwner }
