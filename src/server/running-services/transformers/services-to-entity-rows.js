function buildVersion(version) {
  return {
    kind: 'text',
    value: version ?? null
  }
}

function servicesToEntityRows(envs) {
  return (services) =>
    Object.entries(services).map(([serviceName, service]) => [
      { kind: 'text', value: serviceName },
      ...Object.keys(envs).map((key) => buildVersion(service?.[key]))
    ])
}

export { servicesToEntityRows }
