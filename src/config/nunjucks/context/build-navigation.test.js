import { buildNavigation } from '~/src/config/nunjucks/context/build-navigation.js'
import { scopes } from '~/src/server/common/constants/scopes.js'

const mockRequest = ({ path = '', auth = {} } = {}) => ({
  path,
  hasScope: (scope) => auth?.scope?.includes(scope),
  getUserSession: () => auth,
  routeLookup: (value) => (value === 'home' ? '/' : `/${value}`)
})

describe('#buildNavigation', () => {
  describe('When user is not authenticated', () => {
    test('Should provide expected navigation details', async () => {
      expect(await buildNavigation(mockRequest())).toEqual({
        actions: undefined,
        primary: [
          {
            isActive: false,
            text: 'Home',
            url: '/'
          },
          {
            isActive: false,
            text: 'Documentation',
            url: '/documentation'
          },
          {
            isActive: false,
            text: 'Services',
            url: '/services'
          },
          {
            isActive: false,
            text: 'Test suites',
            url: '/test-suites'
          },
          {
            isActive: false,
            text: 'Utilities',
            url: '/utilities/templates'
          },
          {
            isActive: false,
            text: 'Teams',
            url: '/teams'
          },
          {
            isActive: false,
            text: 'Deployments',
            url: '/deployments'
          },
          {
            isActive: false,
            text: 'Running Services',
            url: '/running-services'
          }
        ],
        admin: undefined
      })
    })
  })

  describe('When user is authenticated', () => {
    test('Should provide expected navigation details', async () => {
      expect(
        await buildNavigation(mockRequest({ auth: { isTenant: true } }))
      ).toEqual({
        actions: [
          {
            isActive: false,
            text: 'Deploy Service',
            url: '/deploy-service'
          },
          {
            isActive: false,
            text: 'Create',
            url: '/create'
          }
        ],
        primary: [
          {
            isActive: false,
            text: 'Home',
            url: '/'
          },
          {
            isActive: false,
            text: 'Documentation',
            url: '/documentation'
          },
          {
            isActive: false,
            text: 'Services',
            url: '/services'
          },
          {
            isActive: false,
            text: 'Test suites',
            url: '/test-suites'
          },
          {
            isActive: false,
            text: 'Utilities',
            url: '/utilities/templates'
          },
          {
            isActive: false,
            text: 'Teams',
            url: '/teams'
          },
          {
            isActive: false,
            text: 'Deployments',
            url: '/deployments'
          },
          {
            isActive: false,
            text: 'Running Services',
            url: '/running-services'
          }
        ],
        admin: undefined
      })
    })
  })

  describe('When user is Admin', () => {
    test('Should provide expected navigation details', async () => {
      expect(
        await buildNavigation(mockRequest({ auth: { isAdmin: true } }))
      ).toEqual({
        actions: [
          {
            isActive: false,
            text: 'Deploy Service',
            url: '/deploy-service'
          },
          {
            isActive: false,
            text: 'Create',
            url: '/create'
          }
        ],
        primary: [
          {
            isActive: false,
            text: 'Home',
            url: '/'
          },
          {
            isActive: false,
            text: 'Documentation',
            url: '/documentation'
          },
          {
            isActive: false,
            text: 'Services',
            url: '/services'
          },
          {
            isActive: false,
            text: 'Test suites',
            url: '/test-suites'
          },
          {
            isActive: false,
            text: 'Utilities',
            url: '/utilities/templates'
          },
          {
            isActive: false,
            text: 'Teams',
            url: '/teams'
          },
          {
            isActive: false,
            text: 'Deployments',
            url: '/deployments'
          },
          {
            isActive: false,
            text: 'Running Services',
            url: '/running-services'
          }
        ],
        admin: [
          {
            isActive: false,
            text: 'Admin',
            url: '/admin'
          }
        ]
      })
    })

    describe('When user has postgres permission', () => {
      test('Should provide expected navigation details', async () => {
        expect(
          await buildNavigation(
            mockRequest({
              auth: { isTenant: true, scope: [scopes.restrictedTechPostgres] }
            })
          )
        ).toEqual({
          actions: [
            {
              isActive: false,
              text: 'Apply Changelog',
              url: '/apply-changelog'
            },
            {
              isActive: false,
              text: 'Deploy Service',
              url: '/deploy-service'
            },
            {
              isActive: false,
              text: 'Create',
              url: '/create'
            }
          ],
          primary: [
            {
              isActive: false,
              text: 'Home',
              url: '/'
            },
            {
              isActive: false,
              text: 'Documentation',
              url: '/documentation'
            },
            {
              isActive: false,
              text: 'Services',
              url: '/services'
            },
            {
              isActive: false,
              text: 'Test suites',
              url: '/test-suites'
            },
            {
              isActive: false,
              text: 'Utilities',
              url: '/utilities/templates'
            },
            {
              isActive: false,
              text: 'Teams',
              url: '/teams'
            },
            {
              isActive: false,
              text: 'Deployments',
              url: '/deployments'
            },
            {
              isActive: false,
              text: 'Running Services',
              url: '/running-services'
            }
          ]
        })
      })
    })
  })

  test('Should mark matching url as Active', async () => {
    expect(
      await buildNavigation(mockRequest({ path: '/running-services' }))
    ).toEqual({
      actions: undefined,
      primary: [
        {
          isActive: false,
          text: 'Home',
          url: '/'
        },
        {
          isActive: false,
          text: 'Documentation',
          url: '/documentation'
        },
        {
          isActive: false,
          text: 'Services',
          url: '/services'
        },
        {
          isActive: false,
          text: 'Test suites',
          url: '/test-suites'
        },
        {
          isActive: false,
          text: 'Utilities',
          url: '/utilities/templates'
        },
        {
          isActive: false,
          text: 'Teams',
          url: '/teams'
        },
        {
          isActive: false,
          text: 'Deployments',
          url: '/deployments'
        },
        {
          isActive: true,
          text: 'Running Services',
          url: '/running-services'
        }
      ],
      admin: undefined
    })
  })
})
