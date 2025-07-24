import { describe, expect, test } from 'vitest'
import { cdpTeamSessionFixture } from '../../../../__fixtures__/admin/cdp-team-session.js'
import { transformSummaryTeamRows } from './transform-summary-team-rows.js'

describe('#transformSummaryTeamRows', () => {
  test('Should provide expected team row transformation', () => {
    expect(transformSummaryTeamRows(cdpTeamSessionFixture)).toEqual([
      {
        actions: {
          classes: 'app-summary__action',
          items: [
            {
              classes: 'app-link',
              href: '/admin/teams/team-details?redirectLocation=summary',
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
          html: '<span data-testid="name">Forests</span>'
        }
      },
      {
        actions: {
          classes: 'app-summary__action',
          items: [
            {
              classes: 'app-link',
              href: '/admin/teams/team-details?redirectLocation=summary',
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
          html: '<span data-testid="description">All things trees, squirrels and plants</span>'
        }
      },
      {
        actions: {
          classes: 'app-summary__action',
          items: [
            {
              classes: 'app-link',
              href: '/admin/teams/find-github-team?redirectLocation=summary&githubSearch=forestry-management',
              text: 'Change',
              visuallyHiddenText: 'GitHub team'
            }
          ]
        },
        key: {
          classes: 'app-summary__heading',
          text: 'GitHub team'
        },
        value: {
          html: expect.stringContaining('@forestry-management')
        }
      },
      {
        actions: {
          classes: 'app-summary__action',
          items: [
            {
              classes: 'app-link',
              href: '/admin/teams/team-details?redirectLocation=summary',
              text: 'Change',
              visuallyHiddenText: 'Service Code'
            }
          ]
        },
        key: {
          classes: 'app-summary__heading',
          text: 'Service Code'
        },
        value: {
          html: '<span data-testid="service-code">AFM</span>'
        }
      },
      {
        actions: {
          classes: 'app-summary__action',
          items: [
            {
              classes: 'app-link',
              href: '/admin/teams/team-details?redirectLocation=summary',
              text: 'Change',
              visuallyHiddenText: 'Alert Emails'
            }
          ]
        },
        key: {
          classes: 'app-summary__heading',
          text: 'Alert Emails'
        },
        value: {
          html: null
        }
      },
      {
        actions: {
          classes: 'app-summary__action',
          items: [
            {
              classes: 'app-link',
              href: '/admin/teams/team-details?redirectLocation=summary',
              text: 'Change',
              visuallyHiddenText: 'Alert Environments'
            }
          ]
        },
        key: {
          classes: 'app-summary__heading',
          text: 'Alert Environments'
        },
        value: {
          html: null
        }
      }
    ])
  })
})
