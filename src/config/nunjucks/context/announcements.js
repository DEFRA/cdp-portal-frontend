import { config } from '../../config.js'

/**
 * Retrieves the support channel URL from the configuration.
 * @type {string}
 */
const supportChannel = config.get('supportChannel')

/**
 * @typedef {object} BreakGlassScope
 * @property {any} scopeId
 * @property {string} scopeName
 * @property {string} [teamId]
 * @property {string} [teamName]
 * @property {Date} [startDate]
 * @property {Date} [endDate]
 */

/**
 * A map containing different announcement messages.
 * @type {Map<string, { html: string } | ((request: import('@hapi/hapi').Request, breakGlass: BreakGlassScope) => { html: string })>}
 */
const announcements = new Map()

announcements.set('unRegisteredUser', (userSession) => ({
  html: `You are not registered on the CDP Portal with the email <em>${userSession?.email}</em>. If you have previously registered on CDP are you logging in with the correct email? If you have not yet registered, contact the Platform team on Slack <a class="app-link app-link--underline" href="${supportChannel}" rel="noopener noreferrer">#cdp-support</a> to register`
}))

announcements.set('isIe', {
  html: `You are using an unsupported browser Internet Explorer. This application will not work as intended in this browser. Use an evergreen browser. If you require further help contact the Platform team via Slack <a class="app-link" href="${supportChannel}" rel="noopener noreferrer">#cdp-support</a>`
})

/**
 * Retrieves the appropriate announcements based on the user's authentication status and browser.
 * @param {UserSession} userSession - The user object containing authentication details.
 * @param {boolean} isInternetExplorer - Flag indicating if the user is using Internet Explorer.
 * @returns {[{html: string}]} - An array of announcement messages.
 */
function getAnnouncements({ userSession, isInternetExplorer }) {
  const messages = []

  if (
    userSession?.isAuthenticated &&
    !(userSession?.isAdmin || userSession?.isTenant)
  ) {
    const registrationMessage = announcements.get('unRegisteredUser')

    messages.push(registrationMessage(userSession))
  }

  if (isInternetExplorer) {
    messages.push(announcements.get('isIe'))
  }

  return messages
}

export { getAnnouncements }

/**
 * @import {UserSession} from '../../server/common/helpers/auth/get-user-session.js'
 */
