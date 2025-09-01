import { transformSummaryUserRows } from './transform-summary-user-rows.js'
import { cdpUserSessionFixture } from '../../../../__fixtures__/admin/cdp-user-session.js'

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
          html: expect.stringContaining('@BABaracus')
        }
      }
    ])
  })
})
