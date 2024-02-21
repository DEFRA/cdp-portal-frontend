import { config } from '~/src/config'
import { buildNavigation } from '~/src/config/nunjucks/context/build-navigation'

const mockRequest = ({ path = '', auth = {} } = {}) => ({
  path,
  getUserSession: async () => auth
})
const hasFeatureFlagTestSuite = config.get('hasFeatureFlagTestSuite')

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
            text: 'Services',
            url: '/services'
          },
          ...(hasFeatureFlagTestSuite
            ? [
                {
                  isActive: false,
                  text: 'Test suites',
                  url: '/test-suites'
                }
              ]
            : []),
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
        await buildNavigation(
          mockRequest({ auth: { isServiceTeamUser: true } })
        )
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
            text: 'Services',
            url: '/services'
          },
          ...(hasFeatureFlagTestSuite
            ? [
                {
                  isActive: false,
                  text: 'Test suites',
                  url: '/test-suites'
                }
              ]
            : []),
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
            text: 'Services',
            url: '/services'
          },
          ...(hasFeatureFlagTestSuite
            ? [
                {
                  isActive: false,
                  text: 'Test suites',
                  url: '/test-suites'
                }
              ]
            : []),
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
          text: 'Services',
          url: '/services'
        },
        ...(hasFeatureFlagTestSuite
          ? [
              {
                isActive: false,
                text: 'Test suites',
                url: '/test-suites'
              }
            ]
          : []),
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
