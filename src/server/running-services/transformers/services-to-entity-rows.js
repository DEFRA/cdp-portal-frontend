function buildVersion(version) {
  return {
    kind: 'text',
    value: version ?? null
  }
}

function servicesToEntityRows(services) {
  return Object.entries(services).map(([serviceName, service]) => [
    { kind: 'text', value: serviceName },
    buildVersion(service?.infraDev),
    buildVersion(service?.management),
    buildVersion(service?.dev),
    buildVersion(service?.test),
    buildVersion(service?.perfTest),
    buildVersion(service?.prod)
  ])
}

export { servicesToEntityRows }
