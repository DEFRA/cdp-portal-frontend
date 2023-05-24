function buildVersion(version) {
  return {
    kind: 'text',
    value: version ?? null
  }
}

function transformServicesToEntityRows(services) {
  return Object.entries(services).map(([serviceName, service]) => [
    { kind: 'text', value: serviceName },
    buildVersion(service?.sandbox),
    buildVersion(service?.development),
    buildVersion(service?.testing),
    buildVersion(service?.preProduction),
    buildVersion(service?.production)
  ])
}

export { transformServicesToEntityRows }
