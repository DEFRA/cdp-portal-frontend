function buildVersion(version) {
  return {
    kind: 'text',
    value: version ?? null
  }
}

function transformServicesToEntityRows(services) {
  return Object.entries(services).map(([serviceName, service]) => [
    { kind: 'text', value: serviceName },
    buildVersion(service?.snd),
    buildVersion(service?.management),
    buildVersion(service?.infraDev),
    buildVersion(service?.development),
    buildVersion(service?.test),
    buildVersion(service?.perfTest),
    buildVersion(service?.production)
  ])
}

export { transformServicesToEntityRows }
