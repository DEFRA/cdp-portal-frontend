import { appConfig } from '~/src/config'

const appPathPrefix = appConfig.get('appPathPrefix')

function buildNavigation(request) {
  return [
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
      text: 'Deployed Services',
      url: `${appPathPrefix}/deployed-services`,
      isActive:
        request?.path?.includes(`${appPathPrefix}/deployed-services`) ?? false
    },
    {
      text: 'Running Services',
      url: `${appPathPrefix}/running-services`,
      isActive:
        request?.path?.includes(`${appPathPrefix}/running-services`) ?? false
    },
    {
      text: 'Create Service',
      url: `${appPathPrefix}/create-service`,
      isActive:
        request?.path?.includes(`${appPathPrefix}/create-service`) ?? false
    },
    {
      text: 'Deploy Service',
      url: `${appPathPrefix}/deploy-service`,
      isActive:
        request?.path?.includes(`${appPathPrefix}/deploy-service`) ?? false
    }
  ]
}

export { buildNavigation }
