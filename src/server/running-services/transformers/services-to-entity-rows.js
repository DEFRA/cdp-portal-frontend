import camelCase from 'lodash/camelCase.js'

import { formatText } from '~/src/config/nunjucks/filters/index.js'

function buildVersion(version, environment, serviceName) {
  return {
    kind: 'text',
    value: version ?? null,
    title: `${serviceName} - ${version} - ${formatText(environment)}`
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
