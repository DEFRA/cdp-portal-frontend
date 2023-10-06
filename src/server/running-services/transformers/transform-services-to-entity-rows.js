function buildVersion(version) {
  return {
    kind: 'text',
    value: version ?? null
  }
}

function transformServicesToEntityRows(services) {
  return Object.entries(services).map(([serviceName, service]) => [
    { kind: 'text', value: serviceName },
    buildVersion(service?.management),
    buildVersion(service?.infraDev),
    buildVersion(service?.dev),
    buildVersion(service?.test),
    buildVersion(service?.perfTest),
    buildVersion(service?.prod)
  ])
}

export { transformServicesToEntityRows }
