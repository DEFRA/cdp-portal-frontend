/**
 * A user is a member of at least one in a group of teams
 * @param authedUser
 * @returns {function(*): *}
 */
function userIsMemberOfATeam(authedUser) {
  return (teamScopes) =>
    authedUser && teamScopes.some((scope) => authedUser?.scope?.includes(scope))
}

function userIsMemberOfATeamDecorator(request) {
  return async (teamScopes) => {
    const authedUser = await request.getUserSession()

    return userIsMemberOfATeam(authedUser)(teamScopes)
  }
}

export { userIsMemberOfATeamDecorator, userIsMemberOfATeam }
