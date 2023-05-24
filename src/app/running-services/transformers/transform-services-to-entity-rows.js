import { startCase } from 'lodash'

function buildVersion(version) {
  return {
    kind: 'text',
    value: version ?? null
  }
}

function extractSimpleDockerName(dockerUri) {
  const match = dockerUri?.match(/^.*\/(.*):.*$/)
  return match?.at(1) ?? null
}

function transformServicesToEntityRows(services) {
  return Object.entries(services).map(([serviceName, service]) => [
    { kind: 'text', value: startCase(serviceName) },
    { kind: 'text', value: extractSimpleDockerName(service?.dockerImage) },
    buildVersion(service?.sandbox),
    buildVersion(service?.development),
    buildVersion(service?.testing),
    buildVersion(service?.preProduction),
    buildVersion(service?.production)
  ])
}

export { transformServicesToEntityRows }
