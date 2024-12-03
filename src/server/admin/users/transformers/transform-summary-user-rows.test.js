import { transformSummaryUserRows } from '~/src/server/admin/users/transformers/transform-summary-user-rows.js'
import { cdpUserSessionFixture } from '~/src/__fixtures__/admin/cdp-user-session.js'

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
          html: '<span data-testid="aad-user-email">B.A.Baracus@defradev.onmicrosoft.com</span>'
        }
      },
      {
        key: {
          classes: 'app-summary__heading',
          text: 'AAD user name'
        },
        value: {
          html: '<span data-testid="aad-user-name">B. A. Baracus</span>'
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
              visuallyHiddenText: 'GitHub user'
            }
          ]
        },
        key: {
          classes: 'app-summary__heading',
          text: 'GitHub user'
        },
        value: {
          html: '<span data-testid="github-user"><a class="app-link" href="https://github.com/BABaracus" data-testid="app-link" target="_blank" rel="noopener noreferrer">@BABaracus</a></span>'
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
        value: { html: null }
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
        value: { html: null }
      }
    ])
  })
})
