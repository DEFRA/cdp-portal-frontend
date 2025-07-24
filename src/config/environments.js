import { scopes } from '../server/common/constants/scopes.js'

const environments = {
  infraDev: { kebabName: 'infra-dev', scope: scopes.admin },
  management: { kebabName: 'management', scope: scopes.admin },
  dev: { kebabName: 'dev', scope: null },
  test: { kebabName: 'test', scope: null },
  extTest: { kebabName: 'ext-test', scope: scopes.externalTest },
  perfTest: { kebabName: 'perf-test', scope: null },
  prod: { kebabName: 'prod', scope: null }
}

const prototypeEnvironments = [
  environments.infraDev,
  environments.dev,
  environments.extTest
]

export { environments, prototypeEnvironments }
