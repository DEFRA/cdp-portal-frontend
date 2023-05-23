function buildServiceUrlText(service) {
  return service.metadata.serviceType.toLowerCase() === 'api'
    ? `https://${service.id}.defra.gov.uk/v1`
    : `https://${service.id}.defra.gov.uk`
}

export { buildServiceUrlText }
