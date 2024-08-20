/**
 * User is in a team
 * @param {UserSession} authedUser
 * @returns {function(*): *}
 */
function userIsTeamMember(authedUser) {
  /** @param {string} scope */
  return (scope) => authedUser?.scope?.includes(scope)
}

function userIsTeamMemberDecorator(request) {
  return async (scope) => {
    const authedUser = await request.getUserSession()

    return userIsTeamMember(authedUser)(scope)
  }
}

export { userIsTeamMemberDecorator, userIsTeamMember }
/**
 * import { UserSession } from '~/src/server/common/helpers/auth/get-user-session.js'
 */
