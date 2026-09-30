import { scopes } from '@defra/cdp-validation-kit'

export const environmentScope = {
  'infra-dev': scopes.admin,
  management: scopes.admin,
  dev: null,
  test: null,
  'ext-test': scopes.externalTest,
  'perf-test': null,
  prod: null
}
