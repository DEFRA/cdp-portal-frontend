function buildVersion(version) {
  return {
    kind: 'text',
    value: version ?? null
  }
}

function transformRunningServicesToEntityRow(runningServices) {
  return Object.values(runningServices).map((service) => [
    buildVersion(service?.management),
    buildVersion(service?.infraDev),
    buildVersion(service?.dev),
    buildVersion(service?.test),
    buildVersion(service?.perfTest),
    buildVersion(service?.prod)
  ])
}

export { transformRunningServicesToEntityRow }
