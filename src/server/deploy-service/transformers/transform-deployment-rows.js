import { startCase } from 'lodash'

import { config } from '~/src/config'
import { cpuToVCpu } from '~/src/server/deploy-service/helpers/cpu-to-vcpu'
import { renderComponent } from '~/src/server/common/helpers/nunjucks/render-component'

const platformCPUResource = config.get('platformCPUResource')
const platformMemoryResource = config.get('platformMemoryResource')

function buildRow(text, value, stepPath) {
  return {
    key: { text, classes: 'app-summary__heading' },
    value: { html: value },
    actions: {
      classes: 'app-summary__action',
      items: [
        {
          href: `/deploy-service/${stepPath}?redirectLocation=summary`,
          text: 'Change',
          classes: 'app-link',
          visuallyHiddenText: text
        }
      ]
    }
  }
}

function markup(value, supportingValue) {
  return `
    <div class="app-row">
      <div class="app-grid-column-one-quarter">
        ${value}
      </div>
      <div class="app-grid-column-three-quarters">
        ${renderComponent('info', {
          isSlim: true,
          html: supportingValue
        })}
      </div>
    </div>`
}

function transformDeploymentRows(details, cpuDetail, memoryDetail) {
  const memory = memoryDetail?.value
  const availableMemory = memory - platformMemoryResource

  const cpu = cpuDetail?.value
  const availableCpu = cpu - platformCPUResource
  const availableCpuAsvCPU = cpuToVCpu(availableCpu)

  return [
    buildRow('Image name', details.imageName, 'details'),
    buildRow('Image version', details.version, 'details'),
    buildRow('Environment', startCase(details.environment), 'details'),
    buildRow('Instance count', details.instanceCount, 'options'),
    buildRow(
      'CPU size',
      markup(
        cpuDetail?.text,
        `After allocation there will be approximately ${availableCpuAsvCPU} vCPU available`
      ),
      'options'
    ),
    buildRow(
      'Memory allocation',
      markup(
        `${memoryDetail?.text} (${memory} MB)`,
        `After allocation there will be approximately ${availableMemory} MB available`
      ),
      'options'
    )
  ]
}

export { transformDeploymentRows }
