import { cdpTeamSessionFixture } from '~/src/__fixtures__/admin/cdp-team-session'
import { transformSummaryTeamRows } from '~/src/server/admin/teams/transformers/transform-summary-team-rows'

describe('#transformSummaryTeamRows', () => {
  test('Should provide expected team row transformation', () => {
    expect(transformSummaryTeamRows(cdpTeamSessionFixture)).toEqual([
      {
        actions: {
          classes: 'app-summary__action',
          items: [
            {
              classes: 'app-link',
              href: '/cdp-portal-frontend/admin/teams/team-details?redirectLocation=summary',
              text: 'Change',
              visuallyHiddenText: 'Name'
            }
          ]
        },
        key: {
          classes: 'app-summary__heading',
          text: 'Name'
        },
        value: {
          html: 'Forests'
        }
      },
      {
        actions: {
          classes: 'app-summary__action',
          items: [
            {
              classes: 'app-link',
              href: '/cdp-portal-frontend/admin/teams/team-details?redirectLocation=summary',
              text: 'Change',
              visuallyHiddenText: 'Description'
            }
          ]
        },
        key: {
          classes: 'app-summary__heading',
          text: 'Description'
        },
        value: {
          html: 'All things trees, squirrels and plants'
        }
      },
      {
        actions: {
          classes: 'app-summary__action',
          items: [
            {
              classes: 'app-link',
              href: '/cdp-portal-frontend/admin/teams/find-github-team?redirectLocation=summary&githubSearch=forestry-management',
              text: 'Change',
              visuallyHiddenText: 'Github team'
            }
          ]
        },
        key: {
          classes: 'app-summary__heading',
          text: 'Github team'
        },
        value: {
          html: '<a class="app-link" href="https://github.com/orgs/DEFRA/teams/forestry-management" target="_blank" rel="noopener noreferrer">@forestry-management</a>'
        }
      }
    ])
  })
})
