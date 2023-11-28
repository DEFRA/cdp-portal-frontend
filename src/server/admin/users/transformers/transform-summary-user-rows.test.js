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
              href: '/admin/users/find-aad-user?redirectLocation=summary&aadQuery=B.A.Baracus@defradev.onmicrosoft.com',
              text: 'Change',
              visuallyHiddenText: 'AAD user email'
            }
          ]
        },
        key: {
          classes: 'app-summary__heading',
          text: 'AAD user email'
        },
        value: {
          html: 'B.A.Baracus@defradev.onmicrosoft.com'
        }
      },
      {
        key: {
          classes: 'app-summary__heading',
          text: 'AAD user name'
        },
        value: {
          html: 'B. A. Baracus'
        }
      },
      {
        actions: {
          classes: 'app-summary__action',
          items: [
            {
              classes: 'app-link',
              href: '/admin/users/find-github-user?redirectLocation=summary&githubSearch=BABaracus',
              text: 'Change',
              visuallyHiddenText: 'Github user'
            }
          ]
        },
        key: {
          classes: 'app-summary__heading',
          text: 'Github user'
        },
        value: {
          html: '<a class="app-link" href="https://github.com/BABaracus" target="_blank" rel="noopener noreferrer">@BABaracus</a>'
        }
      },
      {
        actions: {
          classes: 'app-summary__action',
          items: [
            {
              classes: 'app-link',
              href: '/admin/users/user-details?redirectLocation=summary',
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
              href: '/admin/users/user-details?redirectLocation=summary',
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
