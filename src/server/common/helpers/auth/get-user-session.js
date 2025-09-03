/**
 * @typedef {object} UserSession
 * @property {string} id
 * @property {string} email
 * @property {string} displayName
 * @property {string} loginHint
 * @property {boolean} isAuthenticated
 * @property {string} token
 * @property {string} refreshToken
 * @property {boolean} isAdmin
 * @property {boolean} isTenant
 * @property {boolean} hasBreakGlass - has active breakGlass permission
 * @property {string[]} scope - all scopes
 * @property {number} expiresIn
 * @property {string} expiresAt
 */

/**
 * Get the user session from the cache
 * @returns {Promise<UserSession | null>}
 */
async function getUserSession() {
  const sessionId = this.state?.userSessionCookie?.sessionId
  return sessionId ? await this.server.session.get(sessionId) : null
}

export { getUserSession }
