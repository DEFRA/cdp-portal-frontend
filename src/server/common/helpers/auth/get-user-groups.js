/**
 * @summary Gets authenticated users scope/groups
 * @param request Request
 * @returns {Promise<string[]>}
 */
async function getUserGroups(request) {
  const authedUser = await request.getUserSession()
  return authedUser.scope
}

export { getUserGroups }
