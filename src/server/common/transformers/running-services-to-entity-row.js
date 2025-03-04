import upperFirst from 'lodash/upperFirst.js'
import camelCase from 'lodash/camelCase.js'

function buildVersion(version, environment, serviceName) {
  return {
    kind: 'text',
    value: version ?? null,
    title: version
      ? `${serviceName} - ${version} - ${upperFirst(environment)}`
      : null
  }
}

function runningServicesToEntityRow(environments) {
  return (runningServices) =>
    Object.entries(runningServices).map(([serviceName, versions]) => [
      ...environments.map((environment) =>
        buildVersion(
          versions?.[camelCase(environment)],
          environment,
          serviceName
        )
      )
    ])
}

export { runningServicesToEntityRow }
