/**
 * User is in a team
 * @param authedUser
 * @returns {function(*): *}
 */
function userIsTeamMember(authedUser) {
  return (scope) => authedUser && authedUser?.scope?.includes(scope)
}

function userIsTeamMemberDecorator(request) {
  return async (scope) => {
    const authedUser = await request.getUserSession()

    return userIsTeamMember(authedUser)(scope)
  }
}

export { userIsTeamMemberDecorator, userIsTeamMember }
