import { config } from '../../config.js'
import { fetchActiveProdAccess } from '../../../server/admin/permissions/helpers/fetchers.js'
import { renderComponent } from '../../../server/common/helpers/nunjucks/render-component.js'

/**
 * Retrieves the support channel URL from the configuration.
 * @type {string}
 */
const supportChannel = config.get('supportChannel')

/**
 * @typedef {object} ProdAccess
 * @property {any} scopeId
 * @property {string} scopeName
 * @property {string} [teamId]
 * @property {string} [teamName]
 * @property {Date} [startDate]
 * @property {Date} [endDate]
 */

/**
 * A map containing different announcement messages.
 * @type {Map<string, { html: string } | ((request: import('@hapi/hapi').Request, prodAccess: ProdAccess) => { html: string })>}
 */
const announcements = new Map()

announcements.set('unRegisteredUser', (userSession) => ({
  html: `You are not registered for the CDP Portal with the email <strong>${userSession?.email}</strong>. If you have previously registered on CDP are you using the correct email? If you have not registered, contact the Platform team on Slack <a class="app-link" href="${supportChannel}" rel="noopener noreferrer">#cdp-support</a> to register`
}))

announcements.set('isIe', {
  html: `You are using an unsupported browser Internet Explorer. This application will not work as intended in this browser. Use an evergreen browser. If you require further help contact the Platform team via Slack <a class="app-link" href="${supportChannel}" rel="noopener noreferrer">#cdp-support</a>`
})

announcements.set('hasProdAccess', (request, prodAccess) => {
  const teamHref = request.routeLookup('teams/{teamId}', {
    params: { teamId: prodAccess.teamId }
  })
  const teamDetail = `for the <a class="app-link app-link--underline app-link--text-colour" href="${teamHref}" rel="noopener noreferrer">${prodAccess.teamName}</a> team`
  const from = renderComponent('time', {
    datetime: prodAccess.startDate,
    withoutTooltip: true
  })
  const end = renderComponent('time', {
    datetime: prodAccess.endDate,
    withoutTooltip: true
  })

  if (prodAccess.teamId) {
    return {
      html: `You have active prod access ${teamDetail}. From ${from.toLowerCase()} until ${end.toLowerCase()}`
    }
  }

  return {
    html: 'You have active prod access as an individual user'
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

  if (userSession?.hasProdAccess) {
    const { activeProdAccess } = await fetchActiveProdAccess(request)
    const prodAccessMessage = announcements.get('hasProdAccess')

    messages.push(prodAccessMessage(request, activeProdAccess))
  }

  return messages
}

export { getAnnouncements }

/**
 * @import {UserSession} from '../../server/common/helpers/auth/get-user-session.js'
 */
