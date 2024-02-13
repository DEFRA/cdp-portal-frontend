import { teamFixture } from '~/src/__fixtures__/team'
import { teamLibraries } from '~/src/server/teams/transformers/team-libraries'

describe('#teamLibraries', () => {
  test('Should provide expected team libraries transformation', () => {
    expect(teamLibraries(teamFixture.libraries)).toEqual([])
  })
})
