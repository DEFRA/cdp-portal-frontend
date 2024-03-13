import { kebabCase, upperFirst } from 'lodash'

function buildRunningServicesRowHeadings(environments, size) {
  return [
    ...Object.keys(environments).map((key) => ({
      text: upperFirst(kebabCase(key)),
      size: 'small'
    }))
  ]
}

export { buildRunningServicesRowHeadings }
