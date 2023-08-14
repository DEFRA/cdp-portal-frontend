import { appConfig } from '~/src/config'

const appPathPrefix = appConfig.get('appPathPrefix')

function buildNavigation(request) {
  return {
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
        url: `${appPathPrefix}/deployments/snd`,
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
    admin: [
      {
        text: 'Admin',
        url: `${appPathPrefix}/admin/teams`,
        isActive: request?.path?.includes(`${appPathPrefix}/admin`)
      }
    ]
  }
}

export { buildNavigation }
