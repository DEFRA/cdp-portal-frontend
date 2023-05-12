function buildEntity(environment) {
  const noValue = '---'

  return {
    kind: 'text',
    value: environment?.version ?? noValue
  }
}

function transformRunningServicesToEntityRow(runningService) {
  return [
    {
      kind: 'text',
      value: runningService.serviceName
    },
    buildEntity(runningService?.environments?.development),
    buildEntity(runningService?.environments?.test),
    buildEntity(runningService?.environments?.perfTest),
    buildEntity(runningService?.environments?.production)
  ]
}

export { transformRunningServicesToEntityRow }
