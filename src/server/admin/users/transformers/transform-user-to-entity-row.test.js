import { config } from '~/src/config'
import { cdpUserFixture } from '~/src/__fixtures__/admin/cdp-user'
import { transformUserToEntityRow } from '~/src/server/admin/users/transformers/transform-user-to-entity-row'

const githubOrg = config.get('githubOrg')

describe('#transformUserToEntityRow', () => {
  test('Should provide expected user entity row transformation', () => {
    expect(transformUserToEntityRow(cdpUserFixture.user)).toEqual([
      {
        kind: 'link',
        url: '/cdp-portal-frontend/admin/users/1398fa86-98a2-4ee8-84bb-2468cc71d0ec',
        value: 'Richard D James'
      },
      {
        kind: 'link',
        url: 'mailto:RichardDJames@defradev.onmicrosoft.com',
        value: 'RichardDJames@defradev.onmicrosoft.com'
      },
      {
        kind: 'link',
        newWindow: true,
        url: `https://github.com/orgs/${githubOrg}/people/RichardDJames`,
        value: '@RichardDJames'
      },
      {
        kind: 'text',
        value: 'FGHyu-232342-234234'
      },
      {
        kind: 'text',
        value: '345345-345345'
      }
    ])
  })
})
