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
 * @property {boolean} user
 * @property {string[]} scope - users groups
 * @property {Date} expiresAt
 */

/**
 * Get the user session from the cache
 * @returns {Promise<UserSession|{}>}
 */
async function getUserSession() {
  const sessionId = this.state?.userSessionCookie?.sessionId
  return sessionId ? await this.server.app.cache.get(sessionId) : null
}

export { getUserSession }
