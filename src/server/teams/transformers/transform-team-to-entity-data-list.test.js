import { teamFixture } from '~/src/__fixtures__/team'
import { transformTeamToEntityDataList } from '~/src/server/teams/transformers/transform-team-to-entity-data-list'

describe('#transformTeamToEntityDataList', () => {
  test('Should provide expected team data list transformation', () => {
    expect(transformTeamToEntityDataList(teamFixture)).toEqual([
      {
        entity: {
          kind: 'link',
          newWindow: true,
          url: 'https://github.com/orgs/DEFRA/teams/cdp-platform',
          value: '@cdp-platform'
        },
        heading: 'Github team'
      },
      {
        entity: {
          kind: 'text',
          value: 2
        },
        heading: 'Members'
      },
      {
        entity: {
          kind: 'date',
          value: '2023-10-03T11:11:31.085Z'
        },
        heading: 'Last updated'
      },
      {
        entity: {
          kind: 'date',
          value: '2023-09-28T12:52:14.673Z'
        },
        heading: 'Created'
      }
    ])
  })
})
