import { teamToEntityRow } from '~/src/server/teams/transformers/team-to-entity-row.js'
import { cdpTeamFixture } from '~/src/__fixtures__/admin/cdp-team.js'
import { cdpTeamWithoutGithubFixture } from '~/src/__fixtures__/admin/cdp-team-without-github.js'

describe('#teamToEntityRow', () => {
  test('Should provide expected team transformation', () => {
    expect(teamToEntityRow(cdpTeamFixture.team)).toEqual({
      cells: [
        {
          entity: {
            kind: 'html',
            value: ''
          },
          headers: 'member',
          isCentered: true,
          classes: 'app-entity-table__cell--owned'
        },
        {
          entity: {
            kind: 'link',
            url: '/teams/aabe63e7-87ef-4beb-a596-c810631fc474',
            value: 'Platform'
          },
          headers: 'name'
        },
        {
          entity: {
            kind: 'link',
            newWindow: true,
            url: 'https://github.com/orgs/DEFRA/teams/cdp-platform',
            value: '@cdp-platform'
          },
          headers: 'github-team'
        },
        {
          entity: {
            kind: 'text',
            value: 2
          },
          headers: 'members'
        },
        {
          entity: {
            kind: 'date',
            value: '2023-10-03T11:11:31.085Z'
          },
          headers: 'updated'
        },
        {
          entity: {
            kind: 'date',
            value: '2023-09-28T12:52:14.673Z'
          },
          headers: 'created'
        }
      ]
    })
  })

  test('Should provide expected team transformation when team is not linked to a GitHub team', () => {
    expect(teamToEntityRow(cdpTeamWithoutGithubFixture.team)).toEqual({
      cells: [
        {
          entity: {
            kind: 'html',
            value: ''
          },
          headers: 'member',
          isCentered: true,
          classes: 'app-entity-table__cell--owned'
        },
        {
          entity: {
            kind: 'link',
            url: '/teams/47c04343-4c0e-4326-9848-bef7c1e2eedd',
            value: 'Admin'
          },
          headers: 'name'
        },
        {
          entity: {
            kind: 'link',
            newWindow: true,
            url: null,
            value: null
          },
          headers: 'github-team'
        },
        {
          entity: {
            kind: 'text',
            value: 4
          },
          headers: 'members'
        },
        {
          entity: {
            kind: 'date',
            value: '2023-08-30T08:03:23.657Z'
          },
          headers: 'updated'
        },
        {
          entity: {
            kind: 'date',
            value: '2023-08-23T16:18:28.742Z'
          },
          headers: 'created'
        }
      ]
    })
  })
})
