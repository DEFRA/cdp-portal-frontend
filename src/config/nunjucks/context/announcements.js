import { config } from '~/src/config/config.js'

const announcements = new Map()

announcements.set('unRegisteredUser', {
  html: `Your user is not registered in the CDP Portal. You will not be able to perform certain actions until you have registered. To join us contact the Platform team via Slack <a class="app-link" href="${config.get('supportChannel')}"rel="noopener noreferrer">#cdp-support</a>`
})

function getAnnouncements(authedUser) {
  const announcementMessages = []
  if (
    authedUser?.isAuthenticated &&
    !(authedUser?.isAdmin || authedUser?.isTenant)
  ) {
    announcementMessages.push(announcements.get('unRegisteredUser'))
  }

  return announcementMessages
}

export { announcements, getAnnouncements }
