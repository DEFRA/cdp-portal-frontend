import { serviceParamsValidation } from './service-params-validation.js'
import { scopes } from '@defra/cdp-validation-kit/src/constants/scopes.js'

describe('#serviceParamsValidation', () => {
  describe('With Admin user', () => {
    let options

    beforeEach(() => {
      options = {
        context: {
          auth: {
            credentials: {
              scope: [scopes.admin]
            }
          },
          app: {
            request: {
              entity: { type: 'Microservice' }
            }
          }
        }
      }
    })

    test('Should throw expected error for missing environment', () => {
      const params = { serviceId: 'service123' }

      expect(() => serviceParamsValidation(params, options)).toThrow(
        '"environment" is required'
      )
    })

    test('Should throw expected error for invalid serviceId pattern', () => {
      const params = { environment: 'dev' }

      expect(() => serviceParamsValidation(params, options)).toThrow(
        '"serviceId" is required'
      )
    })

    test('Should return expected validated params', () => {
      const params = { serviceId: 'service123', environment: 'prod' }
      const result = serviceParamsValidation(params, options)

      expect(result).toEqual(params)
    })

    test('Should throw error for invalid environment', () => {
      const params = { serviceId: 'service123', environment: 'invalidEnv' }

      expect(() => serviceParamsValidation(params, options)).toThrow(
        '"environment" must be one of [infra-dev, management, dev, test, perf-test, prod]'
      )
    })
  })

  describe('With Non-admin externalTest user', () => {
    let options

    beforeEach(() => {
      options = {
        context: {
          auth: {
            credentials: {
              scope: [scopes.externalTest]
            }
          }
        }
      }
    })

    test('Should throw error for invalid environment', () => {
      const params = { serviceId: 'service123', environment: 'management' }

      expect(() => serviceParamsValidation(params, options)).toThrow(
        '"environment" must be one of [dev, test, ext-test, perf-test, prod]'
      )
    })
  })

  describe('With Non-admin user', () => {
    let options

    beforeEach(() => {
      options = {
        context: {
          auth: {
            credentials: {
              scope: []
            }
          }
        }
      }
    })

    test('Should throw error for invalid environment', () => {
      const params = { serviceId: 'service123', environment: 'management' }

      expect(() => serviceParamsValidation(params, options)).toThrow(
        '"environment" must be one of [dev, test, perf-test, prod]'
      )
    })
  })
})
