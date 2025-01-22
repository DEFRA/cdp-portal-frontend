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
 * @property {string[]} scope - all scopes
 * @property {UUID[]} uuidScope - only scopes that are UUIDs
 * @property {number} expiresIn
 * @property {Date} expiresAt
 */

/**
 * Get the user session from the cache
 * @returns {Promise<UserSession | null>}
 */
async function getUserSession() {
  const sessionId = this.state?.userSessionCookie?.sessionId
  return sessionId ? await this.server.app.cache.get(sessionId) : null
}

export { getUserSession }
