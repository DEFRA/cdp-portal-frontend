/**
 * @summary Gets authenticated users scope/groups
 * @param {Request} request
 * @returns {Promise<string[]>}
 */
async function getUserGroups(request) {
  const authedUser = await request.getUserSession()
  return authedUser.scope
}

export { getUserGroups }
/**
 * @import {Request} from '@hapi/hapi'
 */
