import { appConfig } from '~/src/config'

const appPathPrefix = appConfig.get('appPathPrefix')

function buildNavigation(request) {
  return {
    primary: [
      {
        text: 'Home',
        url: appPathPrefix,
        isActive: request?.path === `${appPathPrefix}` ?? false
      },
      {
        text: 'Services',
        url: `${appPathPrefix}/services`,
        isActive: request?.path?.includes(`${appPathPrefix}/services`) ?? false
      },
      {
        text: 'Utilities',
        url: `${appPathPrefix}/utilities/templates`,
        isActive: request?.path?.includes(`${appPathPrefix}/utilities`) ?? false
      },
      {
        text: 'Teams',
        url: `${appPathPrefix}/teams`,
        isActive: request?.path?.includes(`${appPathPrefix}/teams`) ?? false
      },
      {
        text: 'Deployments',
        url: `${appPathPrefix}/deployments`,
        isActive:
          request?.path?.includes(`${appPathPrefix}/deployments`) ?? false
      },
      {
        text: 'Running Services',
        url: `${appPathPrefix}/running-services`,
        isActive:
          request?.path?.includes(`${appPathPrefix}/running-services`) ?? false
      }
    ],
    actions: [
      {
        text: 'Deploy Service',
        url: `${appPathPrefix}/deploy-service`,
        isActive:
          request?.path?.includes(`${appPathPrefix}/deploy-service`) ?? false
      },
      {
        text: 'Create Service',
        url: `${appPathPrefix}/create-service`,
        isActive:
          request?.path?.includes(`${appPathPrefix}/create-service`) ?? false
      }
    ]
  }
}

export { buildNavigation }
