function buildVersion(version) {
  const noValue = '---'

  return {
    kind: 'text',
    value: version ?? noValue
  }
}

function transformRunningServicesToEntityRow(runningServices) {

  const byService = {}
  runningServices.forEach(r => { byService[r.service] = {}; } )
  runningServices.forEach(r => { byService[r.service][r.environment] = r.version } )
  
  const out = []
  
  for(const service in byService) {
    out.push([
      {
        kind: 'text',
        value: service
      },
      buildVersion(byService[service].Sandbox),
      buildVersion(byService[service].Development),
      buildVersion(byService[service].Testing),
      buildVersion(byService[service].PreProduction),
      buildVersion(byService[service].Production),
    ]
    )
  }

  // sort list by name
  out.sort( (a,b) => {
    return a[0].value.toLowerCase() < b[0].value.toLowerCase() ? -1 : 1
  })
  
  return out
}

export { transformRunningServicesToEntityRow }
