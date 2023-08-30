import { appConfig } from '~/src/config'

const appPathPrefix = appConfig.get('appPathPrefix')

function deploymentTabs({ path }) {
  return [
    {
      isActive: path.includes(`${appPathPrefix}/deployments/management`),
      url: `${appPathPrefix}/deployments/management`,
      label: 'Management'
    },
    {
      isActive: path.includes(`${appPathPrefix}/deployments/infra-dev`),
      url: `${appPathPrefix}/deployments/infra-dev`,
      label: 'Infra-dev'
    },
    {
      isActive: path.includes(`${appPathPrefix}/deployments/development`),
      url: `${appPathPrefix}/deployments/development`,
      label: 'Development'
    },
    {
      isActive: path.includes(`${appPathPrefix}/deployments/test`),
      url: `${appPathPrefix}/deployments/test`,
      label: 'Test'
    },
    {
      isActive: path.includes(`${appPathPrefix}/deployments/perf-test`),
      url: `${appPathPrefix}/deployments/perf-test`,
      label: 'Perf-test'
    },
    {
      isActive: path.includes(`${appPathPrefix}/deployments/production`),
      url: `${appPathPrefix}/deployments/production`,
      label: 'Production'
    }
  ]
}

export { deploymentTabs }
