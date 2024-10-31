import kebabCase from 'lodash/kebabCase.js'
import upperFirst from 'lodash/upperFirst.js'

function buildRunningServicesRowHeadings(environments) {
  return [
    ...Object.keys(environments).map((key) => ({
      text: upperFirst(kebabCase(key)),
      size: 'small'
    }))
  ]
}

export { buildRunningServicesRowHeadings }
