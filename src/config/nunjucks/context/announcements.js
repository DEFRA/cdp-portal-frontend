import { config } from '../../config.js'
import { renderComponent } from '../../../server/common/helpers/nunjucks/render-component.js'
import { fetchActiveBreakGlass } from '../../../server/admin/permissions/helpers/fetchers.js'

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

announcements.set('hasBreakGlass', (request, breakGlassScope) => {
  const teamHref = request.routeLookup('teams/{teamId}', {
    params: { teamId: breakGlassScope.teamId }
  })
  const teamDetail = `<a class="app-link app-link--underline app-link--text-colour" data-testid="app-link" href="${teamHref}" rel="noopener noreferrer">${breakGlassScope.teamName}</a> team`
  const from = renderComponent('time', {
    datetime: breakGlassScope.startAt,
    withoutTooltip: true
  })
  const end = renderComponent('time', {
    datetime: breakGlassScope.endAt,
    withoutTooltip: true
  })

  if (breakGlassScope.startAt && breakGlassScope.endAt) {
    return {
      html: `You have active break glass for the ${teamDetail}. From ${from.toLowerCase()} until ${end.toLowerCase()}`
    }
  }

  return {
    html: `You have active break glass for the ${teamDetail}.`
  }
})

/**
 * Retrieves the appropriate announcements based on the user's authentication status and browser.
 * @param {import('@hapi/hapi').Request} request
 * @param {UserSession} userSession - The user object containing authentication details.
 * @param {boolean} isInternetExplorer - Flag indicating if the user is using Internet Explorer.
 * @returns {Promise<Array<{html: string}>>} - An array of announcement messages.
 */
async function getAnnouncements({ request, userSession, isInternetExplorer }) {
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

  if (userSession?.hasBreakGlass) {
    const { activeBreakGlass } = await fetchActiveBreakGlass(request)
    const breakGlassMessage = announcements.get('hasBreakGlass')

    messages.push(breakGlassMessage(request, activeBreakGlass))
  }

  return messages
}

export { getAnnouncements }

/**
 * @import {UserSession} from '../../server/common/helpers/auth/get-user-session.js'
 */
