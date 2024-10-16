/**
 * A user is a member of at least one in a group of teams
 * @param {UserSession} authedUser
 * @returns {function(*): *}
 */
// TODO remove duplication
function userIsMemberOfATeam(authedUser) {
  /** @param {string[]} teamScopes */
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
/**
 * import { UserSession } from '~/src/server/common/helpers/auth/get-user-session.js'
 */
