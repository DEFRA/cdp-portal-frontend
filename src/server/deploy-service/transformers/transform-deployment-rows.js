import { startCase } from 'lodash'

import { config } from '~/src/config'

function buildRow(text, value, stepPath) {
  return {
    key: { text, classes: 'app-summary__heading' },
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
          visuallyHiddenText: text
        }
      ]
    }
  }
}

function transformDeploymentRows(details, cpuDetail, memoryDetail) {
  return [
    buildRow('Image name', details.imageName, 'details'),
    buildRow('Image version', details.version, 'details'),
    buildRow('Environment', startCase(details.environment), 'details'),
    buildRow('Instance count', details.instanceCount, 'options'),
    buildRow('CPU size', cpuDetail?.text, 'options'),
    buildRow('Memory allocation', memoryDetail?.text, 'options')
  ]
}

export { transformDeploymentRows }
