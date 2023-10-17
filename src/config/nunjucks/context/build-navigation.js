import { config } from '~/src/config'

const appPathPrefix = config.get('appPathPrefix')

async function buildNavigation(request) {
  const authedUser = await request.getUserSession()

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
        url: `${appPathPrefix}/deployments`,
        isActive: request?.path?.includes(`${appPathPrefix}/deployments`)
      },
      {
        text: 'Running Services',
        url: `${appPathPrefix}/running-services`,
        isActive: request?.path?.includes(`${appPathPrefix}/running-services`)
      }
    ],
    actions: authedUser?.isAuthenticated && [
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
    admin: authedUser?.isAdmin && [
      {
        text: 'Admin',
        url: `${appPathPrefix}/admin`,
        isActive: request?.path?.includes(`${appPathPrefix}/admin`)
      }
    ]
  }
}

export { buildNavigation }
