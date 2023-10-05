import { cdpTeamFixture } from '~/src/__fixtures__/admin/cdp-team'
import { transformCdpTeamToEntityDataList } from '~/src/server/admin/teams/transformers/transform-cdp-team-to-entity-data-list'

describe('#transformCdpTeamToEntityDataList', () => {
  test('Should provide expected team data list transformation', () => {
    expect(transformCdpTeamToEntityDataList(cdpTeamFixture.team)).toEqual([
      {
        entity: {
          kind: 'text',
          value: 'Platform'
        },
        heading: 'Name'
      },
      {
        entity: {
          kind: 'paragraph',
          value: 'The team that runs the platform'
        },
        heading: 'Description'
      },
      {
        entity: {
          kind: 'link',
          newWindow: true,
          url: 'https://github.com/orgs/defra-cdp-sandpit/teams/cdp-platform',
          value: '@cdp-platform'
        },
        heading: 'Github team'
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
