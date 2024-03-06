import { cdpUserFixture } from '~/src/__fixtures__/admin/cdp-user'
import { transformUserToEntityDataList } from '~/src/server/admin/users/transformers/transform-user-to-entity-data-list'

describe('#transformUserToEntityDataList', () => {
  test('Should provide expected user entity list transformation', () => {
    expect(transformUserToEntityDataList(cdpUserFixture.user)).toEqual([
      {
        entity: {
          kind: 'text',
          value: 'B. A. Baracus'
        },
        heading: 'Name'
      },
      {
        entity: {
          kind: 'link',
          url: 'mailto:B.A.Baracus@defradev.onmicrosoft.com',
          value: 'B.A.Baracus@defradev.onmicrosoft.com'
        },
        heading: 'Email'
      },
      {
        entity: {
          kind: 'link',
          newWindow: true,
          url: 'https://github.com/BABaracus',
          value: '@BABaracus'
        },
        heading: 'GitHub'
      },
      {
        entity: {
          kind: 'text',
          value: 'FGHyu-232342-234234'
        },
        heading: 'Defra Aws Id'
      },
      {
        entity: {
          kind: 'text',
          value: '345345-345345'
        },
        heading: 'Defra Vpn Id'
      },
      {
        entity: {
          kind: 'date',
          value: '2023-08-23T16:17:57.883Z'
        },
        heading: 'Created'
      }
    ])
  })
})
