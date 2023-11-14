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
 * @property {boolean} userSession.isInServiceTeam
 * @property {boolean} userSession.user - is this a user that is in a service team
 * @property {Array<string>} userSession.scope - users groups
 * @property {Date} userSession.expiresAt
 *
 * @returns {Promise<userSession|{}>}
 */
async function getUserSession() {
  return this.state?.userSession?.sessionId
    ? await this.server.app.cache.get(this.state.userSession.sessionId)
    : {}
}

export { getUserSession }
