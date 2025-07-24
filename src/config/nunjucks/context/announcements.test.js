import { describe, expect, test } from 'vitest'
import { getAnnouncements } from './announcements.js'
import { config } from '../../config.js'

const supportChannel = config.get('supportChannel')

describe('#getAnnouncements', () => {
  test('Should return no announcements for authenticated admin user', () => {
    const user = { isAuthenticated: true, isAdmin: true }
    const announcements = getAnnouncements(user, false)

    expect(announcements).toEqual([])
  })

  test('Should return no announcements for authenticated tenant user', () => {
    const user = { isAuthenticated: true, isTenant: true }
    const announcements = getAnnouncements(user, false)

    expect(announcements).toEqual([])
  })

  test('Should return unRegisteredUser announcement for authenticated non-admin, non-tenant user', () => {
    const user = { isAuthenticated: true }
    const announcements = getAnnouncements(user, false)

    expect(announcements).toEqual([
      {
        html: `You are not registered for the CDP Portal. Please contact the Platform team on Slack <a class="app-link" href="${supportChannel}"rel="noopener noreferrer">#cdp-support</a> to register`
      }
    ])
  })

  test('Should return isIe announcement for unauthenticated user using IE', () => {
    const announcements = getAnnouncements(null, true)

    expect(announcements).toEqual([
      {
        html: `You are using an unsupported browser Internet Explorer. This application will not work as intended in this browser. Use an evergreen browser. If you require further help contact the Platform team via Slack <a class="app-link" href="${supportChannel}"rel="noopener noreferrer">#cdp-support</a>`
      }
    ])
  })

  test('Should return both announcements for authenticated non-admin, non-tenant user using IE', () => {
    const user = { isAuthenticated: true }
    const announcements = getAnnouncements(user, true)

    expect(announcements).toEqual([
      {
        html: `You are not registered for the CDP Portal. Please contact the Platform team on Slack <a class="app-link" href="${supportChannel}"rel="noopener noreferrer">#cdp-support</a> to register`
      },
      {
        html: `You are using an unsupported browser Internet Explorer. This application will not work as intended in this browser. Use an evergreen browser. If you require further help contact the Platform team via Slack <a class="app-link" href="${supportChannel}"rel="noopener noreferrer">#cdp-support</a>`
      }
    ])
  })

  test('Should return no announcements for unauthenticated user not using IE', () => {
    const announcements = getAnnouncements(null, false)

    expect(announcements).toEqual([])
  })
})
