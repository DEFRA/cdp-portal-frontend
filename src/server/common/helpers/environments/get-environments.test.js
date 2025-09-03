import { scopes } from '@defra/cdp-validation-kit'

import { getEnvironments, getEnvironmentsThatNeed } from './get-environments.js'

describe('#getEnvironments', () => {
  describe('With Admin user', () => {
    test('Should provide expected environments', () => {
      expect(getEnvironments([scopes.admin, scopes.externalTest])).toEqual([
        'infra-dev',
        'management',
        'dev',
        'test',
        'ext-test',
        'perf-test',
        'prod'
      ])
    })
  })

  describe('With service team user', () => {
    test('Should provide expected environments', () => {
      expect(getEnvironments([])).toEqual(['dev', 'test', 'perf-test', 'prod'])
    })
  })

  describe('With service team user with externalTest', () => {
    test('Should provide expected environments', () => {
      expect(getEnvironments([scopes.externalTest])).toEqual([
        'dev',
        'test',
        'ext-test',
        'perf-test',
        'prod'
      ])
    })
  })

  describe('With un-authenticated user', () => {
    test('Should provide expected environments', () => {
      expect(getEnvironments([])).toEqual(['dev', 'test', 'perf-test', 'prod'])
    })
  })

  describe('With Prototype', () => {
    test('Should provide expected environments for admin', () => {
      expect(getEnvironments([scopes.admin], 'Prototype')).toEqual([
        'infra-dev',
        'dev'
      ])
    })

    test('Should provide expected envs for admin with ext-test scope', () => {
      expect(
        getEnvironments([scopes.admin, scopes.externalTest], 'Prototype')
      ).toEqual(['infra-dev', 'dev', 'ext-test'])
    })

    test('Should provide expected environments for non-admin', () => {
      expect(getEnvironments([], 'Prototype')).toEqual(['dev'])
    })

    test('Should provide expected envs for non-admin with ext-test scope', () => {
      expect(getEnvironments([scopes.externalTest], 'Prototype')).toEqual([
        'dev',
        'ext-test'
      ])
    })
  })
})

describe('#getEnvironmentsThatNeed', () => {
  describe('For admin scope', () => {
    test('Should provide expected environments', () => {
      expect(getEnvironmentsThatNeed([scopes.admin])).toEqual([
        'infra-dev',
        'management'
      ])
    })
  })

  describe('For externalTest scope', () => {
    test('Should provide expected environments', () => {
      expect(getEnvironmentsThatNeed([scopes.externalTest])).toEqual([
        'ext-test'
      ])
    })
  })

  describe('For externalTest and admin scope', () => {
    test('Should provide expected environments', () => {
      expect(
        getEnvironmentsThatNeed([scopes.externalTest, scopes.admin])
      ).toEqual(['infra-dev', 'management', 'ext-test'])
    })
  })

  describe('For prototype and admin scope', () => {
    test('Should provide expected environments', () => {
      expect(getEnvironmentsThatNeed([scopes.admin], 'Prototype')).toEqual([
        'infra-dev'
      ])
    })
  })

  describe('For prototype and ext-test & admin scope', () => {
    test('Should provide expected environments', () => {
      expect(
        getEnvironmentsThatNeed(
          [scopes.externalTest, scopes.admin],
          'Prototype'
        )
      ).toEqual(['infra-dev', 'ext-test'])
    })
  })
})
