/**
 * @summary Gets authenticated users scope/groups
 * @param {import('@hapi/hapi').Request} request
 * @returns {Promise<string[]>}
 */
async function getUserGroups(request) {
  const authedUser = await request.getUserSession()
  return authedUser.scope
}

export { getUserGroups }
