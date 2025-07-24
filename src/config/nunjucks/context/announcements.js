import { config } from '../../config.js'

/**
 * Retrieves the support channel URL from the configuration.
 * @type {string}
 */
const supportChannel = config.get('supportChannel')

/**
 * A map containing different announcement messages.
 * @type {Map<string, {html: string}>}
 */
const announcements = new Map()

announcements.set('unRegisteredUser', {
  html: `You are not registered for the CDP Portal. Please contact the Platform team on Slack <a class="app-link" href="${supportChannel}"rel="noopener noreferrer">#cdp-support</a> to register`
})

announcements.set('isIe', {
  html: `You are using an unsupported browser Internet Explorer. This application will not work as intended in this browser. Use an evergreen browser. If you require further help contact the Platform team via Slack <a class="app-link" href="${supportChannel}"rel="noopener noreferrer">#cdp-support</a>`
})

/**
 * Retrieves the appropriate announcements based on the user's authentication status and browser.
 * @param {object|null} user - The user object containing authentication details.
 * @param {boolean} isIe - Flag indicating if the user is using Internet Explorer.
 * @returns {Array<{html: string}>} - An array of announcement messages.
 */
function getAnnouncements(user, isIe) {
  const announcementMessages = []

  if (user?.isAuthenticated && !(user?.isAdmin || user?.isTenant)) {
    announcementMessages.push(announcements.get('unRegisteredUser'))
  }

  if (isIe) {
    announcementMessages.push(announcements.get('isIe'))
  }

  return announcementMessages
}

export { getAnnouncements }
