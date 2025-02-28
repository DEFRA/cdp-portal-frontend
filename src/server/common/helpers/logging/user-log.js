/**
 * Simple user information logging helper
 * @param {string} prefix
 * @param {{id: string, displayName: string, email:string}} user
 * @param {{isAdmin: boolean|undefined, isTenant: boolean|undefined}} scopeFlags
 * @param {Array<string>| undefined} scopes
 * @returns {string}
 */
function userLog(prefix, user, scopeFlags, scopes) {
  const messages = [
    prefix,
    `UserId: ${user?.id}, displayName: ${user?.displayName}, email: ${user?.email}`,
    `isAdmin: ${scopeFlags?.isAdmin ?? 'null'}, isTenant: ${scopeFlags?.isTenant ?? 'null'}`,
    `scopes: ${scopes?.join(' ') ?? 'null'}`
  ]

  return messages.join(', ')
}

export { userLog }
