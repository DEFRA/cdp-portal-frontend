import { appConfig } from '~/src/config'

const appPathPrefix = appConfig.get('appPathPrefix')

function buildNavigation(request) {
  return {
    isAzureAuthenticated: request?.yar?.get('auth')?.isAuthenticated,
    primary: [
      {
        text: 'Home',
        url: appPathPrefix,
        isActive: request?.path === appPathPrefix
      },
      {
        text: 'Services',
        url: `${appPathPrefix}/services`,
        isActive: request?.path?.includes(`${appPathPrefix}/services`)
      },
      {
        text: 'Utilities',
        url: `${appPathPrefix}/utilities/templates`,
        isActive: request?.path?.includes(`${appPathPrefix}/utilities`)
      },
      {
        text: 'Teams',
        url: `${appPathPrefix}/teams`,
        isActive: request?.path?.includes(`${appPathPrefix}/teams`)
      },
      {
        text: 'Deployments',
        url: `${appPathPrefix}/deployments`,
        isActive: request?.path?.includes(`${appPathPrefix}/deployments`)
      },
      {
        text: 'Running Services',
        url: `${appPathPrefix}/running-services`,
        isActive: request?.path?.includes(`${appPathPrefix}/running-services`)
      }
    ],
    actions: [
      {
        text: 'Deploy Service',
        url: `${appPathPrefix}/deploy-service`,
        isActive: request?.path?.includes(`${appPathPrefix}/deploy-service`)
      },
      {
        text: 'Create Service',
        url: `${appPathPrefix}/create-service`,
        isActive: request?.path?.includes(`${appPathPrefix}/create-service`)
      }
    ],
    login: [
      {
        text: 'Login',
        url: `${appPathPrefix}/login`,
        isActive: request?.path?.includes(`${appPathPrefix}/login`)
      }
    ],
    logout: [
      {
        text: 'Logout',
        url: `${appPathPrefix}/logout`,
        isActive: request?.path?.includes(`${appPathPrefix}/logout`)
      }
    ],
    admin: [
      {
        text: 'Admin',
        url: `${appPathPrefix}/admin`,
        isActive: request?.path?.includes(`${appPathPrefix}/admin`)
      }
    ]
  }
}

export { buildNavigation }
