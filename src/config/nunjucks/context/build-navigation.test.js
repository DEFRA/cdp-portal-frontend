import { buildNavigation } from '~/src/config/nunjucks/context/build-navigation'
import { appConfig } from '~/src/config'

const appPathPrefix = appConfig.get('appPathPrefix')

const mockRequest = ({ path = '', isAdmin = false } = {}) => ({
  path,
  yar: {
    get: () => ({
      credentials: {
        profile: {
          isAdmin
        }
      }
    })
  }
})

describe('#buildNavigation', () => {
  describe('When user is not Admin', () => {
    test('Should provide expected navigation details', () => {
      expect(buildNavigation(mockRequest())).toEqual({
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
    test('Should provide expected navigation details', () => {
      expect(buildNavigation(mockRequest({ isAdmin: true }))).toEqual({
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

  test('Should mark matching url as Active', () => {
    expect(
      buildNavigation(
        mockRequest({ path: `${appPathPrefix}/running-services` })
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
          isActive: true,
          text: 'Running Services',
          url: '/cdp-portal-frontend/running-services'
        }
      ],
      admin: []
    })
  })
})
