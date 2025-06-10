function userIsServiceOwner(authedUser) {
  return (teams) =>
    authedUser && teams.some((team) => authedUser?.scope?.includes(team))
}

function userIsServiceOwnerDecorator(request) {
  /** @param {string[]} teamsForTheService */
  return async (teamsForTheService) => {
    const authedUser = await request.getUserSession()

    return userIsServiceOwner(authedUser)(teamsForTheService)
  }
}

export { userIsServiceOwnerDecorator, userIsServiceOwner }
