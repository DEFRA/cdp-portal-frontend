import { cdpTeamFixture } from '~/src/__fixtures__/admin/cdp-team'
import { transformCdpTeamToEntityRow } from '~/src/server/admin/teams/transformers/transform-cdp-team-to-entity-row'

describe('#transformCdpTeamToEntityRow', () => {
  test('Should provide expected team row transformation', () => {
    expect(transformCdpTeamToEntityRow(cdpTeamFixture.team)).toEqual([
      {
        kind: 'link',
        url: '/cdp-portal-frontend/admin/teams/47c04343-4c0e-4326-9848-bef7c1e2eedd',
        value: 'Admin'
      },
      {
        kind: 'text',
        value: 'The Admin team 💪🏻'
      },
      {
        kind: 'text',
        value: 4
      }
    ])
  })
})
