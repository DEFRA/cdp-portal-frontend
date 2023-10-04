import { config } from '~/src/config'

const appPathPrefix = config.get('appPathPrefix')

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
      isActive: path.includes(`${appPathPrefix}/deployments/dev`),
      url: `${appPathPrefix}/deployments/dev`,
      label: 'Dev'
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
      isActive: path.includes(`${appPathPrefix}/deployments/prod`),
      url: `${appPathPrefix}/deployments/prod`,
      label: 'Prod'
    }
  ]
}

export { deploymentTabs }
