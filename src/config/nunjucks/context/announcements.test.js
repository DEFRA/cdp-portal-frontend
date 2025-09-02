import { getAnnouncements } from './announcements.js'
import { config } from '../../config.js'
import { userSessionFixture } from '../../../__fixtures__/user-session.js'

const supportChannel = config.get('supportChannel')

const registrationAnnouncement = (userSession) =>
  `You are not registered on the CDP Portal with the email <em>${userSessionFixture.email}</em>. If you have previously registered on CDP are you logging in with the correct email? If you have not yet registered, contact the Platform team on Slack <a class="app-link app-link--underline" href="https://defra-digital-team.slack.com/archives/C05UJ3SE5C6" rel="noopener noreferrer">#cdp-support</a> to register`

const oldIeAnnouncement = `You are using an unsupported browser Internet Explorer. This application will not work as intended in this browser. Use an evergreen browser. If you require further help contact the Platform team via Slack <a class="app-link" href="${supportChannel}" rel="noopener noreferrer">#cdp-support</a>`

describe('#getAnnouncements', () => {
  test('Should return no announcements for authenticated admin user', () => {
    const userSession = { isAuthenticated: true, isAdmin: true }
    const announcements = getAnnouncements({
      userSession,
      isInternetExplorer: false
    })

    expect(announcements).toEqual([])
  })

  test('Should return no announcements for authenticated tenant user', () => {
    const userSession = { isAuthenticated: true, isTenant: true }
    const announcements = getAnnouncements(userSession, false)

    expect(announcements).toEqual([])
  })

  test('Should return unRegisteredUser announcement for authenticated non-admin, non-tenant user', () => {
    const announcements = getAnnouncements({
      userSession: {
        ...userSessionFixture,
        authenticated: true,
        isAdmin: false,
        isTenant: false
      },
      isInternetExplorer: false
    })

    expect(announcements).toEqual([
      { html: registrationAnnouncement(userSessionFixture) }
    ])
  })

  test('Should return isIe announcement for unauthenticated user using IE', () => {
    const announcements = getAnnouncements({
      userSession: null,
      isInternetExplorer: true
    })

    expect(announcements).toEqual([{ html: oldIeAnnouncement }])
  })

  test('Should return both announcements for authenticated non-admin, non-tenant user using IE', () => {
    const announcements = getAnnouncements({
      userSession: {
        ...userSessionFixture,
        authenticated: true,
        isAdmin: false,
        isTenant: false
      },
      isInternetExplorer: true
    })

    expect(announcements).toEqual([
      { html: registrationAnnouncement(userSessionFixture) },
      { html: oldIeAnnouncement }
    ])
  })

  test('Should return no announcements for unauthenticated user not using IE', () => {
    const announcements = getAnnouncements({
      userSession: null,
      isInternetExplorer: false
    })

    expect(announcements).toEqual([])
  })
})
