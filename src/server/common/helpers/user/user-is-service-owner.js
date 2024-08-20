import { userIsMemberOfATeam } from '~/src/server/common/helpers/user/user-is-member-of-a-team'

function userIsServiceOwner(authedUser) {
  return userIsMemberOfATeam(authedUser)
}

function userIsServiceOwnerDecorator(request) {
  /** @param {string[]} teamScopes */
  return async (teamScopes) => {
    const authedUser = await request.getUserSession()

    return userIsServiceOwner(authedUser)(teamScopes)
  }
}

export { userIsServiceOwnerDecorator, userIsServiceOwner }
