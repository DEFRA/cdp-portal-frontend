import { config } from '~/src/config/config.js'
import { cdpTeamFixture } from '~/src/__fixtures__/admin/cdp-team.js'
import { transformTeamToEntityRow } from '~/src/server/admin/teams/transformers/transform-team-to-entity-row.js'

const githubOrg = config.get('githubOrg')

describe('#transformCdpTeamToEntityRow', () => {
  test('Should provide expected team row transformation', () => {
    expect(transformTeamToEntityRow(cdpTeamFixture.team)).toEqual([
      {
        kind: 'link',
        url: '/admin/teams/aabe63e7-87ef-4beb-a596-c810631fc474',
        value: 'Platform'
      },
      {
        kind: 'text',
        value: 'The team that runs the platform'
      },
      {
        kind: 'link',
        newWindow: true,
        url: `https://github.com/orgs/${githubOrg}/teams/cdp-platform`,
        value: '@cdp-platform'
      },
      {
        kind: 'text',
        value: ['CDP']
      },
      {
        kind: 'html',
        value: 'alerts@cdp.com'
      },
      {
        kind: 'text',
        value: 2
      }
    ])
  })
})
