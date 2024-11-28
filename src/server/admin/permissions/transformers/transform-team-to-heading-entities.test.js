import { cdpTeamFixture } from '~/src/__fixtures__/admin/cdp-team.js'
import { transformTeamToHeadingEntities } from '~/src/server/admin/teams/transformers/transform-team-to-heading-entities.js'

describe('#transformCdpTeamToHeadingEntities', () => {
  test('Should provide expected team heading transformation', () => {
    expect(transformTeamToHeadingEntities(cdpTeamFixture.team)).toEqual([
      {
        kind: 'date',
        label: 'Last updated',
        value: '2023-10-03T11:11:31.085Z'
      }
    ])
  })
})
