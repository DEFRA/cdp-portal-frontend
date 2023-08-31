import { cdpTeamFixture } from '~/src/__fixtures__/admin/cdp-team'
import { transformCdpTeamToHeadingEntities } from '~/src/server/admin/teams/transformers/transform-cdp-team-to-heading-entities'

describe('#transformCdpTeamToHeadingEntities', () => {
  test('Should provide expected team heading transformation', () => {
    expect(transformCdpTeamToHeadingEntities(cdpTeamFixture.team)).toEqual([
      {
        kind: 'date',
        label: 'Last updated',
        value: '2023-08-30T08:03:23.657Z'
      }
    ])
  })
})
