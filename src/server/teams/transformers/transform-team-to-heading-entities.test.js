import { teamFixture } from '~/src/__fixtures__/team'
import { transformTeamToHeadingEntities } from '~/src/server/teams/transformers/transform-team-to-heading-entities'

describe('#transformTeamToHeadingEntities', () => {
  test('Should provide expected team heading transformation', () => {
    expect(transformTeamToHeadingEntities(teamFixture)).toEqual([
      {
        kind: 'link',
        label: 'Github team',
        newWindow: true,
        url: 'https://github.com/orgs/defra-cdp-sandpit/teams/cdp-platform',
        value: '@cdp-platform'
      },
      {
        kind: 'date',
        label: 'Last updated',
        value: '2023-10-03T11:11:31.085Z'
      }
    ])
  })
})