import { cdpUserFixture } from '~/src/__fixtures__/admin/cdp-user'
import { transformUserToEntityRow } from '~/src/server/admin/users/transformers/transform-user-to-entity-row'

describe('#transformUserToEntityRow', () => {
  test('Should provide expected user entity row transformation', () => {
    expect(transformUserToEntityRow(cdpUserFixture.user)).toEqual([
      {
        kind: 'link',
        url: '/admin/users/1398fa86-98a2-4ee8-84bb-2468cc71d0ec',
        value: 'B. A. Baracus'
      },
      {
        kind: 'link',
        url: 'mailto:B.A.Baracus@defradev.onmicrosoft.com',
        value: 'B.A.Baracus@defradev.onmicrosoft.com'
      },
      {
        kind: 'link',
        newWindow: true,
        url: `https://github.com/orgs/DEFRA/people/BABaracus`,
        value: '@BABaracus'
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
