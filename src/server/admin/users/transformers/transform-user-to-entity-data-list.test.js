import { cdpUserFixture } from '~/src/__fixtures__/admin/cdp-user.js'
import { transformUserToEntityDataList } from '~/src/server/admin/users/transformers/transform-user-to-entity-data-list.js'

describe('#transformUserToEntityDataList', () => {
  test('Should provide expected user entity list transformation', () => {
    expect(transformUserToEntityDataList(cdpUserFixture.user)).toEqual([
      {
        entity: {
          kind: 'text',
          value: 'B. A. Baracus'
        },
        heading: {
          text: 'Name'
        }
      },
      {
        entity: {
          kind: 'link',
          url: 'mailto:B.A.Baracus@defradev.onmicrosoft.com',
          value: 'B.A.Baracus@defradev.onmicrosoft.com'
        },
        heading: {
          text: 'Email'
        }
      },
      {
        entity: {
          kind: 'link',
          newWindow: true,
          url: 'https://github.com/BABaracus',
          value: '@BABaracus'
        },
        heading: {
          text: 'GitHub'
        }
      },
      {
        entity: {
          kind: 'list',
          value: [
            {
              kind: 'link',
              url: '/admin/teams/9e068bb9-1452-426e-a4ca-2e675a942a89',
              value: 'Bees'
            },
            {
              kind: 'link',
              url: '/admin/teams/6ed0400a-a8a0-482b-b45a-109634cd1274',
              value: 'Trees-and-forests'
            }
          ]
        },
        heading: {
          text: 'Teams'
        }
      },
      {
        entity: {
          kind: 'text',
          value: 'FGHyu-232342-234234'
        },
        heading: {
          text: 'Defra Aws Id'
        }
      },
      {
        entity: {
          kind: 'text',
          value: '345345-345345'
        },
        heading: {
          text: 'Defra Vpn Id'
        }
      },
      {
        entity: {
          kind: 'date',
          value: '2023-08-23T16:17:57.883Z'
        },
        heading: {
          text: 'Created'
        }
      }
    ])
  })
})
