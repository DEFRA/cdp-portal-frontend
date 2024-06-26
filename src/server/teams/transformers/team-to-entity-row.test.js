import { config } from '~/src/config'
import { teamToEntityRow } from '~/src/server/teams/transformers/team-to-entity-row'
import { cdpTeamFixture } from '~/src/__fixtures__/admin/cdp-team'
import { cdpTeamWithoutGithubFixture } from '~/src/__fixtures__/admin/cdp-team-without-github'

const githubOrg = config.get('githubOrg')

describe('#teamToEntityRow', () => {
  test('Should provide expected team transformation', () => {
    expect(teamToEntityRow(cdpTeamFixture.team)).toEqual([
      {
        kind: 'link',
        url: '/teams/aabe63e7-87ef-4beb-a596-c810631fc474',
        value: 'Platform'
      },
      {
        kind: 'link',
        newWindow: true,
        url: `https://github.com/orgs/${githubOrg}/teams/cdp-platform`,
        value: '@cdp-platform'
      },
      {
        kind: 'text',
        value: 2
      },
      {
        kind: 'date',
        value: '2023-10-03T11:11:31.085Z'
      },
      {
        kind: 'date',
        value: '2023-09-28T12:52:14.673Z'
      }
    ])
  })

  test('Should provide expected team transformation when team is not linked to a GitHub team', () => {
    expect(teamToEntityRow(cdpTeamWithoutGithubFixture.team)).toEqual([
      {
        kind: 'link',
        url: '/teams/47c04343-4c0e-4326-9848-bef7c1e2eedd',
        value: 'Admin'
      },
      {
        kind: 'link',
        newWindow: true,
        url: null,
        value: null
      },
      {
        kind: 'text',
        value: 4
      },
      {
        kind: 'date',
        value: '2023-08-30T08:03:23.657Z'
      },
      {
        kind: 'date',
        value: '2023-08-23T16:18:28.742Z'
      }
    ])
  })
})
