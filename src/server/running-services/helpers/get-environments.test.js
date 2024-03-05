import { getEnvironments } from '~/src/server/running-services/helpers/get-environments'

describe('#getEnvironments', () => {
  describe('With Admin user', () => {
    test('Should provide expected environments', async () => {
      const mockRequest = {
        getUserSession: jest.fn().mockResolvedValue({
          isAdmin: true
        })
      }

      expect(await getEnvironments(mockRequest)).toEqual({
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
    test('Should provide expected environments', async () => {
      const mockRequest = {
        getUserSession: jest.fn().mockResolvedValue({
          isInAServiceTeam: true
        })
      }

      expect(await getEnvironments(mockRequest)).toEqual({
        dev: 'dev',
        perfTest: 'perf-test',
        prod: 'prod',
        test: 'test'
      })
    })
  })

  describe('With un-authenticated user', () => {
    test('Should provide expected environments', async () => {
      const mockRequest = {
        getUserSession: jest.fn().mockResolvedValue({})
      }

      expect(await getEnvironments(mockRequest)).toEqual({
        dev: 'dev',
        perfTest: 'perf-test',
        prod: 'prod',
        test: 'test'
      })
    })
  })
})
