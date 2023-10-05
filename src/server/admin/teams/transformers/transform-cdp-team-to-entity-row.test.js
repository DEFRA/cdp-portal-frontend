import { cdpTeamFixture } from '~/src/__fixtures__/admin/cdp-team'
import { transformCdpTeamToEntityRow } from '~/src/server/admin/teams/transformers/transform-cdp-team-to-entity-row'

describe('#transformCdpTeamToEntityRow', () => {
  test('Should provide expected team row transformation', () => {
    expect(transformCdpTeamToEntityRow(cdpTeamFixture.team)).toEqual([
      {
        kind: 'link',
        url: '/cdp-portal-frontend/admin/teams/aabe63e7-87ef-4beb-a596-c810631fc474',
        value: 'Platform'
      },
      {
        kind: 'text',
        value: 'The team that runs the platform'
      },
      {
        kind: 'link',
        newWindow: true,
        url: 'https://github.com/orgs/defra-cdp-sandpit/teams/cdp-platform',
        value: '@cdp-platform'
      },
      {
        kind: 'text',
        value: 2
      }
    ])
  })
})
