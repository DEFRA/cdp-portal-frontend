import { config } from '~/src/config'
import { cdpTeamFixture } from '~/src/__fixtures__/admin/cdp-team'
import { transformCdpTeamToEntityDataList } from '~/src/server/admin/teams/transformers/transform-cdp-team-to-entity-data-list'

const githubOrg = config.get('githubOrg')

describe('#transformCdpTeamToEntityDataList', () => {
  test('Should provide expected team data list transformation', () => {
    expect(transformCdpTeamToEntityDataList(cdpTeamFixture.team)).toEqual([
      {
        entity: {
          kind: 'link',
          newWindow: true,
          url: `https://github.com/orgs/${githubOrg}/teams/cdp-platform`,
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
