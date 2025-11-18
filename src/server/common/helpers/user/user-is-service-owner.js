function userIsServiceOwner(userSession) {
  return (teams) =>
    userSession &&
    teams.some((team) => userSession?.scope?.includes(`team:${team}`))
}

function userIsServiceOwnerDecorator(request) {
  /** @param {string[]} teamsForTheService */
  return (teamsForTheService) => {
    const userSession = request.auth.credentials

    return userIsServiceOwner(userSession)(teamsForTheService)
  }
}

export { userIsServiceOwnerDecorator, userIsServiceOwner }
