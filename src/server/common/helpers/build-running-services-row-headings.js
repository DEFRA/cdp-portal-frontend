import upperFirst from 'lodash/upperFirst.js'

function buildRunningServicesRowHeadings(environments) {
  return [
    ...environments.map((env) => ({
      text: upperFirst(env),
      size: 'small'
    }))
  ]
}

export { buildRunningServicesRowHeadings }
