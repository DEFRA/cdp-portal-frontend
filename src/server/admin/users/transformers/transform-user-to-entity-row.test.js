import { cdpUserFixture } from '../../../../__fixtures__/admin/cdp-user.js'
import { transformUserToEntityRow } from './transform-user-to-entity-row.js'

describe('#transformUserToEntityRow', () => {
  test('Should provide expected user entity row transformation', () => {
    expect(transformUserToEntityRow(cdpUserFixture)).toEqual({
      cells: [
        {
          entity: {
            kind: 'link',
            url: '/admin/users/1398fa86-98a2-4ee8-84bb-2468cc71d0ec',
            value: 'B. A. Baracus'
          },
          headers: 'name'
        },
        {
          entity: {
            kind: 'link',
            url: 'mailto:B.A.Baracus@defradev.onmicrosoft.com',
            value: 'B.A.Baracus@defradev.onmicrosoft.com'
          },
          headers: 'email'
        },
        {
          entity: {
            kind: 'link',
            newWindow: true,
            url: 'https://github.com/orgs/DEFRA/people/BABaracus',
            value: '@BABaracus'
          },
          headers: 'github-user'
        },
        {
          entity: {
            kind: 'date',
            formatString: 'EEEE do MMMM yyyy, HH:mm:ss',
            value: '2024-11-15T10:00:00.000Z'
          },
          headers: 'last-active'
        },
        {
          entity: {
            kind: 'date',
            formatString: 'EEEE do MMMM yyyy, HH:mm:ss',
            value: '2023-08-24T15:31:52.259Z'
          },
          headers: 'last-updated'
        },
        {
          entity: {
            kind: 'date',
            formatString: 'EEEE do MMMM yyyy, HH:mm:ss',
            value: '2023-08-23T16:17:57.883Z'
          },
          headers: 'created'
        }
      ]
    })
  })
})
