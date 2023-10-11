import { buildNavigation } from '~/src/config/nunjucks/context/build-navigation'
import { config } from '~/src/config'

const appPathPrefix = config.get('appPathPrefix')

const mockRequest = ({ path = '', auth = {} } = {}) => ({
  path,
  getUserSession: async () => auth
})

describe('#buildNavigation', () => {
  describe('When user is not authenticated', () => {
    test('Should provide expected navigation details', async () => {
      expect(await buildNavigation(mockRequest())).toEqual({
        actions: [],
        primary: [
          {
            isActive: false,
            text: 'Home',
            url: '/cdp-portal-frontend'
          },
          {
            isActive: false,
            text: 'Services',
            url: '/cdp-portal-frontend/services'
          },
          {
            isActive: false,
            text: 'Utilities',
            url: '/cdp-portal-frontend/utilities/templates'
          },
          {
            isActive: false,
            text: 'Teams',
            url: '/cdp-portal-frontend/teams'
          },
          {
            isActive: false,
            text: 'Deployments',
            url: '/cdp-portal-frontend/deployments'
          },
          {
            isActive: false,
            text: 'Running Services',
            url: '/cdp-portal-frontend/running-services'
          }
        ],
        admin: []
      })
    })
  })

  describe('When user is authenticated', () => {
    test('Should provide expected navigation details', async () => {
      expect(
        await buildNavigation(mockRequest({ auth: { isAuthenticated: true } }))
      ).toEqual({
        actions: [
          {
            isActive: false,
            text: 'Deploy Service',
            url: '/cdp-portal-frontend/deploy-service'
          },
          {
            isActive: false,
            text: 'Create Service',
            url: '/cdp-portal-frontend/create-service'
          }
        ],
        primary: [
          {
            isActive: false,
            text: 'Home',
            url: '/cdp-portal-frontend'
          },
          {
            isActive: false,
            text: 'Services',
            url: '/cdp-portal-frontend/services'
          },
          {
            isActive: false,
            text: 'Utilities',
            url: '/cdp-portal-frontend/utilities/templates'
          },
          {
            isActive: false,
            text: 'Teams',
            url: '/cdp-portal-frontend/teams'
          },
          {
            isActive: false,
            text: 'Deployments',
            url: '/cdp-portal-frontend/deployments'
          },
          {
            isActive: false,
            text: 'Running Services',
            url: '/cdp-portal-frontend/running-services'
          }
        ],
        admin: []
      })
    })
  })

  describe('When user is Admin', () => {
    test('Should provide expected navigation details', async () => {
      expect(
        await buildNavigation(
          mockRequest({ auth: { isAdmin: true, isAuthenticated: true } })
        )
      ).toEqual({
        actions: [
          {
            isActive: false,
            text: 'Deploy Service',
            url: '/cdp-portal-frontend/deploy-service'
          },
          {
            isActive: false,
            text: 'Create Service',
            url: '/cdp-portal-frontend/create-service'
          }
        ],
        primary: [
          {
            isActive: false,
            text: 'Home',
            url: '/cdp-portal-frontend'
          },
          {
            isActive: false,
            text: 'Services',
            url: '/cdp-portal-frontend/services'
          },
          {
            isActive: false,
            text: 'Utilities',
            url: '/cdp-portal-frontend/utilities/templates'
          },
          {
            isActive: false,
            text: 'Teams',
            url: '/cdp-portal-frontend/teams'
          },
          {
            isActive: false,
            text: 'Deployments',
            url: '/cdp-portal-frontend/deployments'
          },
          {
            isActive: false,
            text: 'Running Services',
            url: '/cdp-portal-frontend/running-services'
          }
        ],
        admin: [
          {
            isActive: false,
            text: 'Admin',
            url: '/cdp-portal-frontend/admin'
          }
        ]
      })
    })
  })

  test('Should mark matching url as Active', async () => {
    expect(
      await buildNavigation(
        mockRequest({ path: `${appPathPrefix}/running-services` })
      )
    ).toEqual({
      actions: [],
      primary: [
        {
          isActive: false,
          text: 'Home',
          url: '/cdp-portal-frontend'
        },
        {
          isActive: false,
          text: 'Services',
          url: '/cdp-portal-frontend/services'
        },
        {
          isActive: false,
          text: 'Utilities',
          url: '/cdp-portal-frontend/utilities/templates'
        },
        {
          isActive: false,
          text: 'Teams',
          url: '/cdp-portal-frontend/teams'
        },
        {
          isActive: false,
          text: 'Deployments',
          url: '/cdp-portal-frontend/deployments'
        },
        {
          isActive: true,
          text: 'Running Services',
          url: '/cdp-portal-frontend/running-services'
        }
      ],
      admin: []
    })
  })
})
