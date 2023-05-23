import { startCase } from 'lodash'

function buildVersion(version) {
  return {
    kind: 'text',
    value: version ?? null
  }
}

function transformServicesToEntityRows(services) {
  return Object.entries(services)
    .map(([serviceName, environments]) => {
      return [
        { kind: 'text', value: startCase(serviceName) },
        { kind: 'text', value: serviceName },
        buildVersion(environments?.sandbox),
        buildVersion(environments?.development),
        buildVersion(environments?.testing),
        buildVersion(environments?.preProduction),
        buildVersion(environments?.production)
      ]
    })
    .sort((a, b) =>
      a.at(0).value.toLowerCase() < b.at(0).value.toLowerCase() ? -1 : 1
    )
}

export { transformServicesToEntityRows }
