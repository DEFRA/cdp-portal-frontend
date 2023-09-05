import { buildNavigation } from '~/src/config/nunjucks/context/build-navigation'
import { appConfig } from '~/src/config'

const appPathPrefix = appConfig.get('appPathPrefix')
const mockRequest = (path = '') => ({ path })

describe('#buildNavigation', () => {
  test('Should provide expected navigation details', () => {
    expect(buildNavigation(mockRequest())).toEqual({
      isAzureAuthenticated: undefined,
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
      ],
      login: [
        {
          text: 'Login',
          url: `/cdp-portal-frontend/login`,
          isActive: false
        }
      ],
      logout: [
        {
          text: 'Logout',
          url: `/cdp-portal-frontend/logout`,
          isActive: false
        }
      ]
    })
  })

  test('Should mark matching url as Active', () => {
    expect(
      buildNavigation(mockRequest(`${appPathPrefix}/running-services`))
    ).toEqual({
      isAzureAuthenticated: undefined,
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
      admin: [
        {
          isActive: false,
          text: 'Admin',
          url: '/cdp-portal-frontend/admin'
        }
      ],
      login: [
        {
          text: 'Login',
          url: `/cdp-portal-frontend/login`,
          isActive: false
        }
      ],
      logout: [
        {
          text: 'Logout',
          url: `/cdp-portal-frontend/logout`,
          isActive: false
        }
      ]
    })
  })
})
