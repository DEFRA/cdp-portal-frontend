function buildVersion(version) {
  return {
    kind: 'text',
    value: version ?? null
  }
}

function transformRunningServicesToEntityRow(runningServices) {
  return Object.values(runningServices).map((service) => [
    buildVersion(service?.snd),
    buildVersion(service?.management),
    buildVersion(service?.infraDev),
    buildVersion(service?.development),
    buildVersion(service?.test),
    buildVersion(service?.perfTest),
    buildVersion(service?.production)
  ])
}

export { transformRunningServicesToEntityRow }
