function buildVersion(version) {
  return {
    kind: 'text',
    value: version ?? null
  }
}

function transformRunningServicesToEntityRow(runningServices) {
  return Object.values(runningServices).map((service) => [
    buildVersion(service?.sandbox),
    buildVersion(service?.development),
    buildVersion(service?.testing),
    buildVersion(service?.preProduction),
    buildVersion(service?.production)
  ])
}

export { transformRunningServicesToEntityRow }
