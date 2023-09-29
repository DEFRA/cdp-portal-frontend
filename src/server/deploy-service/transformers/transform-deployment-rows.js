import { startCase } from 'lodash'

import { config, environments } from '~/src/config'
import { fetchDeployServiceOptions } from '~/src/server/deploy-service/helpers/fetch-deploy-service-options'

function buildRow(name, value, stepPath) {
  return {
    key: { text: name, classes: 'app-summary__heading' },
    value: { html: value },
    actions: {
      classes: 'app-summary__action',
      items: [
        {
          href:
            config.get('appPathPrefix') +
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

function buildCpuInfo({ text, value }) {
  const availableCpu = value - 256
  const availableCpuAsvCPU = (availableCpu / 1024).toString().replace(/^0/g, '')

  return `${text}
    <div class="app-info-hint">
      256 (.25 vCPU) automatically allocated to platform processes. You have <strong>${availableCpu} (${availableCpuAsvCPU} vCPU)</strong> available.
    </div>`
}

function buildMemoryInfo({ text, value }) {
  const availableMemory = value - 256
  const availableMemoryAsGb = availableMemory / 1024

  return `${text}
    <div class="app-info-hint">
      .25 GB (256 MB) automatically allocated to platform processes. You have <strong>${availableMemoryAsGb} GB (${availableMemory} MB)</strong> available.
    </div>`
}

async function transformDeploymentRows(details) {
  const environmentText = environmentDisplayText[details.environment]

  const { cpuOptions, ecsCpuToMemoryOptionsMap } =
    await fetchDeployServiceOptions()

  const cpuDetail = cpuOptions.find(
    ({ value }) => value === parseInt(details?.cpu, 10)
  )

  const memoryDetail = ecsCpuToMemoryOptionsMap[details?.cpu]?.find(
    ({ value }) => value === parseInt(details?.memory, 10)
  )

  return [
    buildRow('Image name', details.imageName, 'details'),
    buildRow('Image version', details.version, 'details'),
    buildRow('Environment', environmentText, 'details'),
    buildRow('Instance count', details.instanceCount, 'options'),
    buildRow('CPU size', buildCpuInfo(cpuDetail), 'options'),
    buildRow('Memory allocation', buildMemoryInfo(memoryDetail), 'options')
  ]
}

export { transformDeploymentRows }
