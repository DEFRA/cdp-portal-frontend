import { getEnvironments } from '~/src/server/common/helpers/environments/get-environments'

describe('#getEnvironments', () => {
  describe('With Admin user', () => {
    test('Should provide expected environments', () => {
      expect(getEnvironments(true)).toEqual({
        dev: 'dev',
        infraDev: 'infra-dev',
        management: 'management',
        perfTest: 'perf-test',
        prod: 'prod',
        test: 'test'
      })
    })
  })

  describe('With service team user', () => {
    test('Should provide expected environments', () => {
      expect(getEnvironments(false)).toEqual({
        dev: 'dev',
        perfTest: 'perf-test',
        prod: 'prod',
        test: 'test'
      })
    })
  })

  describe('With un-authenticated user', () => {
    test('Should provide expected environments', () => {
      expect(getEnvironments()).toEqual({
        dev: 'dev',
        perfTest: 'perf-test',
        prod: 'prod',
        test: 'test'
      })
    })
  })
})
