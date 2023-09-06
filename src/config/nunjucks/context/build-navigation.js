import { appConfig } from '~/src/config'

const appPathPrefix = appConfig.get('appPathPrefix')

function buildNavigation(request) {
  let isAuthenticated
  // sometimes the `_store` in yar is uninitialized causing an exception when we first hit the page for the very first time
  // this catches this weird edge case
  try {
    isAuthenticated = request?.yar?.get('auth')?.isAuthenticated
  } catch (error) {
    // sometimes the `_store` inside of yar is uninitialized causing an exception when we first hit the page
    isAuthenticated = false
  }
  return {
    isAzureAuthenticated: isAuthenticated,
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
