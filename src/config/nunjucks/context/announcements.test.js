import { stripHtml } from '../../../../test-helpers/strip-html.js'

import { getAnnouncements } from './announcements.js'
import { config } from '../../config.js'
import { userSessionFixture } from '../../../__fixtures__/user-session.js'
import { fetchActiveBreakGlass } from '../../../server/admin/permissions/helpers/fetchers.js'
import {
  activeBreakGlassFixture,
  activeTeamBreakGlassFixture,
  activeUserBreakGlassFixture
} from '../../../__fixtures__/active-break-glass.js'

const supportChannel = config.get('supportChannel')

vi.mock('../../../server/admin/permissions/helpers/fetchers.js')

const registrationAnnouncement = (userSession) =>
  `You are not registered on the CDP Portal with the email <em>${userSessionFixture.email}</em>. If you have previously registered on CDP are you logging in with the correct email? If you have not yet registered, contact the Platform team on Slack <a class="app-link app-link--underline" href="https://defra-digital-team.slack.com/archives/C05UJ3SE5C6" rel="noopener noreferrer">#cdp-support</a> to register`

const oldIeAnnouncement = `You are using an unsupported browser Internet Explorer. This application will not work as intended in this browser. Use an evergreen browser. If you require further help contact the Platform team via Slack <a class="app-link" href="${supportChannel}" rel="noopener noreferrer">#cdp-support</a>`

const mockRequest = {
  routeLookup: vi.fn().mockReturnValue('/teams/1234')
}

describe('#getAnnouncements', () => {
  beforeAll(() => {
    vi.useFakeTimers()
    vi.setSystemTime(new Date('2025-09-03'))
  })

  afterAll(() => {
    vi.useRealTimers()
  })

  test('Should return no announcements for authenticated admin user', async () => {
    const userSession = { isAuthenticated: true, isAdmin: true }
    const announcements = await getAnnouncements({
      request: {},
      userSession,
      isInternetExplorer: false
    })

    expect(announcements).toEqual([])
  })

  test('Should return no announcements for authenticated tenant user', async () => {
    const userSession = { isAuthenticated: true, isTenant: true }
    const announcements = await getAnnouncements({
      request: {},
      userSession,
      isInternetExplorer: false
    })

    expect(announcements).toEqual([])
  })

  test('Should return unRegisteredUser announcement for authenticated non-admin, non-tenant user', async () => {
    fetchActiveBreakGlass.mockResolvedValue(activeBreakGlassFixture)

    const announcements = await getAnnouncements({
      request: mockRequest,
      userSession: {
        ...userSessionFixture,
        authenticated: true,
        isAdmin: false,
        isTenant: false
      },
      isInternetExplorer: false
    })

    expect(announcements).toHaveLength(2)
    expect(announcements.at(0)).toEqual({
      html: registrationAnnouncement(userSessionFixture)
    })
    expect(announcements.at(1)).toEqual({
      html: expect.any(String)
    })
    expect(stripHtml(announcements.at(1).html)).toContain(
      'You have active break glass for the Platform team. From today at 10:10 until today at 12:10'
    )
  })

  test('Should return isIe announcement for unauthenticated user using IE', async () => {
    const announcements = await getAnnouncements({
      userSession: null,
      isInternetExplorer: true
    })

    expect(announcements).toEqual([{ html: oldIeAnnouncement }])
  })

  test('Should return both announcements for authenticated non-admin, non-tenant user using IE', async () => {
    fetchActiveBreakGlass.mockResolvedValue(activeBreakGlassFixture)

    const announcements = await getAnnouncements({
      request: mockRequest,
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
      { html: oldIeAnnouncement },
      { html: expect.any(String) }
    ])

    expect(stripHtml(announcements.at(2).html)).toContain(
      'You have active break glass for the Platform team. From today at 10:10 until today at 12:10'
    )
  })

  test('Should return team and time based break glass', async () => {
    fetchActiveBreakGlass.mockResolvedValue(activeBreakGlassFixture)

    const announcements = await getAnnouncements({
      request: mockRequest,
      userSession: {
        ...userSessionFixture,
        authenticated: true,
        isAdmin: true,
        isTenant: false
      }
    })

    expect(announcements).toEqual([{ html: expect.any(String) }])

    expect(stripHtml(announcements.at(0).html)).toContain(
      'You have active break glass for the Platform team. From today at 10:10 until today at 12:10'
    )
  })

  test('Should return team based break glass', async () => {
    fetchActiveBreakGlass.mockResolvedValue(activeTeamBreakGlassFixture)

    const announcements = await getAnnouncements({
      request: mockRequest,
      userSession: {
        ...userSessionFixture,
        authenticated: true,
        isAdmin: true,
        isTenant: false
      }
    })

    expect(announcements).toEqual([{ html: expect.any(String) }])

    expect(stripHtml(announcements.at(0).html)).toContain(
      'You have active break glass for the Platform team'
    )
  })

  test('Should return user based break glass', async () => {
    fetchActiveBreakGlass.mockResolvedValue(activeUserBreakGlassFixture)

    const announcements = await getAnnouncements({
      request: mockRequest,
      userSession: {
        ...userSessionFixture,
        authenticated: true,
        isAdmin: true,
        isTenant: false
      }
    })

    expect(announcements).toEqual([{ html: expect.any(String) }])

    expect(stripHtml(announcements.at(0).html)).toContain(
      'You have active break glass'
    )
  })

  test('Should return no announcements for unauthenticated user not using IE', async () => {
    const announcements = await getAnnouncements({
      request: {},
      userSession: null,
      isInternetExplorer: false
    })

    expect(announcements).toEqual([])
  })
})
