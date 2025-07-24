import { describe, expect, test } from 'vitest'
import { cdpTeamFixture } from '../../../../__fixtures__/admin/cdp-team.js'
import { transformTeamToEntityRow } from './transform-team-to-entity-row.js'

describe('#transformCdpTeamToEntityRow', () => {
  test('Should provide expected team row transformation', () => {
    expect(transformTeamToEntityRow(cdpTeamFixture.team)).toEqual({
      cells: [
        {
          entity: {
            kind: 'link',
            url: '/admin/teams/aabe63e7-87ef-4beb-a596-c810631fc474',
            value: 'Platform'
          },
          headers: 'name'
        },
        {
          entity: {
            kind: 'text',
            value: 'The team that runs the platform'
          },
          headers: 'description'
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
            value: ['CDP']
          },
          headers: 'service-codes'
        },
        {
          entity: {
            kind: 'html',
            value: 'alerts@cdp.com'
          },
          headers: 'alert-emails'
        },
        {
          entity: {
            kind: 'html',
            value: 'infra-dev, management'
          },
          headers: 'alert-environments'
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
          headers: 'last-updated'
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
})
