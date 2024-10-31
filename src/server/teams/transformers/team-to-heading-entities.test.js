import { teamFixture } from '~/src/__fixtures__/team.js'
import { teamToHeadingEntities } from '~/src/server/teams/transformers/team-to-heading-entities.js'

describe('#teamToHeadingEntities', () => {
  test('Should provide expected team heading transformation', () => {
    expect(teamToHeadingEntities(teamFixture)).toEqual([
      {
        kind: 'date',
        label: 'Last updated',
        value: '2023-10-03T11:11:31.085Z'
      }
    ])
  })
})
