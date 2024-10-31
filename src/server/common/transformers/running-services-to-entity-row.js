import upperFirst from 'lodash/upperFirst.js'
import kebabCase from 'lodash/kebabCase.js'

function buildVersion(version, environment, serviceName) {
  return {
    kind: 'text',
    value: version ?? null,
    title: `${serviceName} - ${version} - ${upperFirst(kebabCase(environment))}`
  }
}

function runningServicesToEntityRow(environments) {
  return (runningServices) =>
    Object.entries(runningServices).map(([serviceName, versions]) => [
      ...Object.entries(environments).map(([key, environment]) =>
        buildVersion(versions?.[key], environment, serviceName)
      )
    ])
}

export { runningServicesToEntityRow }
