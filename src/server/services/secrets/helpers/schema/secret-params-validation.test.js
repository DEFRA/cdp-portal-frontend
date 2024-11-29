import Joi from 'joi'

import { secretParamsValidation } from '~/src/server/services/secrets/helpers/schema/secret-params-validation.js'

describe('#secretParamsValidation', () => {
  describe('With Admin user', () => {
    let options

    beforeEach(() => {
      options = {
        context: {
          auth: {
            credentials: {
              scope: ['admin']
            }
          }
        }
      }
    })

    test('Should throw expected error for missing environment', () => {
      const params = { serviceId: 'service123' }

      expect(() => secretParamsValidation(params, options)).toThrow(
        new Joi.ValidationError('"environment" is required')
      )
    })

    test('Should throw expected error for invalid serviceId pattern', () => {
      const params = { environment: 'dev' }

      expect(() => secretParamsValidation(params, options)).toThrow(
        new Joi.ValidationError('"serviceId" is required')
      )
    })

    test('Should return expected validated params', () => {
      const params = { serviceId: 'service123', environment: 'prod' }
      const result = secretParamsValidation(params, options)

      expect(result).toEqual(params)
    })

    test('Should throw error for invalid environment', () => {
      const params = { serviceId: 'service123', environment: 'invalidEnv' }

      expect(() => secretParamsValidation(params, options)).toThrow(
        new Joi.ValidationError(
          '"environment" must be one of [infra-dev, management, dev, test, perf-test, prod]'
        )
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
              scope: ['externalTest']
            }
          }
        }
      }
    })

    test('Should throw error for invalid environment', () => {
      const params = { serviceId: 'service123', environment: 'management' }

      expect(() => secretParamsValidation(params, options)).toThrow(
        new Joi.ValidationError(
          '"environment" must be one of [dev, test, ext-test, perf-test, prod]'
        )
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

      expect(() => secretParamsValidation(params, options)).toThrow(
        new Joi.ValidationError(
          '"environment" must be one of [dev, test, perf-test, prod]'
        )
      )
    })
  })
})
