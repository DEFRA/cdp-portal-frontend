import {
  getEnvironments,
  getEnvironmentsThatNeed
} from '~/src/server/common/helpers/environments/get-environments.js'
import { scopes } from '~/src/server/common/constants/scopes.js'

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
      expect(getEnvironments()).toEqual(['dev', 'test', 'perf-test', 'prod'])
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
      expect(getEnvironments()).toEqual(['dev', 'test', 'perf-test', 'prod'])
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
})
