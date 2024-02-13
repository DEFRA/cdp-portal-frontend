import { config } from '~/src/config'
import { teamFixture } from '~/src/__fixtures__/team'
import { teamToEntityDataList } from '~/src/server/teams/transformers/team-to-entity-data-list'

const githubOrg = config.get('githubOrg')

describe('#teamToEntityDataList', () => {
  test('Should provide expected team data list transformation', () => {
    expect(teamToEntityDataList(teamFixture)).toEqual([
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
