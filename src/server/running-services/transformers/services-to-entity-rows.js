import kebabCase from 'lodash/kebabCase.js'
import upperFirst from 'lodash/upperFirst.js'
import camelCase from 'lodash/camelCase.js'

function buildVersion(version, environment, serviceName) {
  return {
    kind: 'text',
    value: version ?? null,
    title: `${serviceName} - ${version} - ${upperFirst(kebabCase(environment))}`
  }
}

function servicesToEntityRows(environments) {
  return (services) =>
    Object.entries(services).map(([serviceName, versions]) => [
      { kind: 'text', value: serviceName },
      ...environments.map((environment) =>
        buildVersion(
          versions?.[camelCase(environment)],
          environment,
          serviceName
        )
      )
    ])
}

export { servicesToEntityRows }
