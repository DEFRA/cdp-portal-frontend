import { scopes } from '@defra/cdp-validation-kit'

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

const performanceEnvironments = [
  environments.infraDev,
  environments.management,
  environments.perfTest
]

const environmentsExceptInfraDev = [
  environments.management,
  environments.dev,
  environments.test,
  environments.perfTest,
  environments.extTest,
  environments.prod
]

export {
  environments,
  prototypeEnvironments,
  performanceEnvironments,
  environmentsExceptInfraDev
}
