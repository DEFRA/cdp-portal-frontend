import { teamFixture } from '~/src/__fixtures__/team'
import { transformTeamLibraries } from '~/src/server/teams/transformers/transform-team-libraries'

describe('#transformTeamLibraries', () => {
  test('Should provide expected team libraries transformation', () => {
    expect(transformTeamLibraries(teamFixture.libraries)).toEqual([])
  })
})
