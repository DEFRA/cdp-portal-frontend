/**
 * @typedef {Object} userSession
 * @property {string} userSession.id
 * @property {string} userSession.email
 * @property {string} userSession.displayName
 * @property {string} userSession.loginHint
 * @property {boolean} userSession.isAuthenticated
 * @property {string} userSession.token
 * @property {string} userSession.refreshToken
 * @property {boolean} userSession.isAdmin
 * @property {boolean} userSession.isTenant
 * @property {boolean} userSession.user
 * @property {Array<string>} userSession.scope - users groups
 * @property {Date} userSession.expiresAt
 *
 * @returns {Promise<userSession|{}>}
 */
async function getUserSession() {
  const sessionId = this.state?.userSession?.sessionId
  return sessionId ? await this.server.app.cache.get(sessionId) : {}
}

export { getUserSession }
