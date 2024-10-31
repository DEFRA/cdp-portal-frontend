import { config } from '~/src/config/index.js'
import { cdpTeamFixture } from '~/src/__fixtures__/admin/cdp-team.js'
import { transformTeamToEntityDataList } from '~/src/server/admin/teams/transformers/transform-team-to-entity-data-list.js'

const githubOrg = config.get('githubOrg')

describe('#transformCdpTeamToEntityDataList', () => {
  test('Should provide expected team data list transformation', () => {
    expect(transformTeamToEntityDataList(cdpTeamFixture.team)).toEqual([
      {
        entity: {
          kind: 'link',
          newWindow: true,
          url: `https://github.com/orgs/${githubOrg}/teams/cdp-platform`,
          value: '@cdp-platform'
        },
        heading: {
          text: 'GitHub team'
        }
      },
      {
        heading: {
          text: 'Service Codes'
        },
        entity: {
          kind: 'text',
          value: ['CDP']
        }
      },
      {
        entity: {
          kind: 'date',
          value: '2023-09-28T12:52:14.673Z'
        },
        heading: {
          text: 'Created'
        }
      }
    ])
  })
})
