import { config } from '~/src/config'
import { teamFixture } from '~/src/__fixtures__/team'
import { transformTeamToHeadingEntities } from '~/src/server/teams/transformers/transform-team-to-heading-entities'

const githubOrg = config.get('githubOrg')

describe('#transformTeamToHeadingEntities', () => {
  test('Should provide expected team heading transformation', () => {
    expect(transformTeamToHeadingEntities(teamFixture)).toEqual([
      {
        kind: 'link',
        label: 'Github team',
        newWindow: true,
        url: `https://github.com/orgs/${githubOrg}/teams/cdp-platform`,
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
