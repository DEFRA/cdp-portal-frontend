import { transformSummaryUserRows } from '~/src/server/admin/users/transformers/transform-summary-user-rows'
import { cdpUserSessionFixture } from '~/src/__fixtures__/admin/cdp-user-session'

describe('#transformSummaryUserRows', () => {
  test('Should provide expected user row transformation', () => {
    expect(transformSummaryUserRows(cdpUserSessionFixture)).toEqual([
      {
        actions: {
          classes: 'app-summary__action',
          items: [
            {
              classes: 'app-link',
              href: '/cdp-portal-frontend/admin/users/find-aad-user?redirectLocation=summary&aadQuery=RichardDJames@defradev.onmicrosoft.com',
              text: 'Change',
              visuallyHiddenText: 'AAD user'
            }
          ]
        },
        key: {
          classes: 'app-summary__heading',
          text: 'AAD user'
        },
        value: {
          html: 'RichardDJames@defradev.onmicrosoft.com'
        }
      },
      {
        actions: {
          classes: 'app-summary__action',
          items: [
            {
              classes: 'app-link',
              href: '/cdp-portal-frontend/admin/users/find-github-user?redirectLocation=summary&githubSearch=RichardDJames',
              text: 'Change',
              visuallyHiddenText: 'GitHub user'
            }
          ]
        },
        key: {
          classes: 'app-summary__heading',
          text: 'GitHub user'
        },
        value: {
          html: 'RichardDJames'
        }
      },
      {
        actions: {
          classes: 'app-summary__action',
          items: [
            {
              classes: 'app-link',
              href: '/cdp-portal-frontend/admin/users/user-details?redirectLocation=summary',
              text: 'Change',
              visuallyHiddenText: 'CDP user name'
            }
          ]
        },
        key: {
          classes: 'app-summary__heading',
          text: 'CDP user name'
        },
        value: {
          html: 'Richard D James'
        }
      },
      {
        actions: {
          classes: 'app-summary__action',
          items: [
            {
              classes: 'app-link',
              href: '/cdp-portal-frontend/admin/users/user-details?redirectLocation=summary',
              text: 'Change',
              visuallyHiddenText: 'Defra AWS ID'
            }
          ]
        },
        key: {
          classes: 'app-summary__heading',
          text: 'Defra AWS ID'
        },
        value: {}
      },
      {
        actions: {
          classes: 'app-summary__action',
          items: [
            {
              classes: 'app-link',
              href: '/cdp-portal-frontend/admin/users/user-details?redirectLocation=summary',
              text: 'Change',
              visuallyHiddenText: 'Defra VPN ID'
            }
          ]
        },
        key: {
          classes: 'app-summary__heading',
          text: 'Defra VPN ID'
        },
        value: {}
      }
    ])
  })
})
