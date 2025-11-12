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
 * @param {string} [sessionId] - optional sessionId. Only needed when the userSessionCookie.sessionId is not available
 * @returns {Promise<UserSession | null>}
 */
async function getUserSession(
  sessionId = this.state?.userSessionCookie?.sessionId
) {
  if (this.app.userSession) {
    return this.app.userSession
  }

  this.logger.info('Called getUserSession helper')
  const session = sessionId ? await this.server.session.get(sessionId) : null

  this.app.userSession = session

  return session
}

export { getUserSession }
