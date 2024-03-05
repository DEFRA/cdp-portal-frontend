import { kebabCase, upperFirst } from 'lodash'

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
      ...Object.entries(environments).map(([key, environment]) =>
        buildVersion(versions?.[key], environment, serviceName)
      )
    ])
}

export { servicesToEntityRows }
