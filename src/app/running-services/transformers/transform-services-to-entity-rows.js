import { startCase } from 'lodash'

function buildVersion(version) {
  return {
    kind: 'text',
    value: version ?? null
  }
}

function transformServicesToEntityRows(services) {
  return Object.entries(services).map(([serviceName, environments]) => [
    { kind: 'text', value: startCase(serviceName) },
    { kind: 'text', value: serviceName },
    buildVersion(environments?.sandbox),
    buildVersion(environments?.development),
    buildVersion(environments?.testing),
    buildVersion(environments?.preProduction),
    buildVersion(environments?.production)
  ])
}

export { transformServicesToEntityRows }
