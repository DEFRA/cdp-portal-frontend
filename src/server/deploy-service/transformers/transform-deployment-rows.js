import { appConfig, environments } from '~/src/config'
import { fetchDeployServiceOptions } from '~/src/server/deploy-service/helpers/fetch-deploy-service-options'
import { startCase } from 'lodash'

function buildRow(name, value, stepPath) {
  return {
    key: { text: name },
    value: { text: value },
    actions: {
      items: [
        {
          href:
            appConfig.get('appPathPrefix') +
            `/deploy-service/${stepPath}?redirectLocation=summary`,
          text: 'Change',
          classes: 'app-link',
          visuallyHiddenText: name
        }
      ]
    }
  }
}

// Reverse the keys and values, so we can get environment name by value
const environmentDisplayText = Object.entries(environments).reduce(
  (obj, [key, value]) => ({
    ...obj,
    [value]: startCase(key)
  }),
  {}
)

async function transformDeploymentRows(details) {
  const environmentText = environmentDisplayText[details.environment]

  const { cpuOptions, ecsCpuToMemoryOptionsMap } =
    await fetchDeployServiceOptions()

  const cpuDisplayText = cpuOptions.find(
    ({ value }) => value === parseInt(details?.cpu, 10)
  )

  const memoryDisplayText = ecsCpuToMemoryOptionsMap[details?.cpu]?.find(
    ({ value }) => value === parseInt(details?.memory, 10)
  )

  return [
    buildRow('Image name', details.imageName, 'details'),
    buildRow('Image version', details.version, 'details'),
    buildRow('Environment', environmentText, 'details'),
    buildRow('Instance count', details.instanceCount, 'options'),
    buildRow('CPU size', cpuDisplayText?.text, 'options'),
    buildRow('Memory allocation', memoryDisplayText?.text, 'options')
  ]
}

export { transformDeploymentRows }
