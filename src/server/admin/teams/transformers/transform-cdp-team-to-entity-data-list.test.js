import { cdpTeamFixture } from '~/src/__fixtures__/admin/cdp-team'
import { transformCdpTeamToEntityDataList } from '~/src/server/admin/teams/transformers/transform-cdp-team-to-entity-data-list'

describe('#transformCdpTeamToEntityDataList', () => {
  test('Should provide expected team data list transformation', () => {
    expect(transformCdpTeamToEntityDataList(cdpTeamFixture.team)).toEqual([
      {
        entity: {
          kind: 'text',
          value: 'Admin'
        },
        heading: 'Name'
      },
      {
        entity: {
          kind: 'paragraph',
          value: 'The Admin team 💪🏻'
        },
        heading: 'Description'
      },
      {
        entity: {
          kind: 'link',
          newWindow: true,
          url: 'https://github.com/orgs/defra-cdp-sandpit/teams/fisheries',
          value: '@fisheries'
        },
        heading: 'Github team'
      },
      {
        entity: {
          kind: 'date',
          value: '2023-08-23T16:18:28.742Z'
        },
        heading: 'Created'
      }
    ])
  })
})
