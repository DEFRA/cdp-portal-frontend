import Joi from 'joi'

import { bucketParamsValidation } from '~/src/server/services/buckets/helpers/schema/bucket-params-validation.js'

describe('#bucketParamsValidation', () => {
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

      expect(() => bucketParamsValidation(params, options)).toThrow(
        new Joi.ValidationError('"environment" is required')
      )
    })

    test('Should throw expected error for invalid serviceId pattern', () => {
      const params = { environment: 'dev' }

      expect(() => bucketParamsValidation(params, options)).toThrow(
        new Joi.ValidationError('"serviceId" is required')
      )
    })

    test('Should return expected validated params', () => {
      const params = { serviceId: 'service123', environment: 'prod' }
      const result = bucketParamsValidation(params, options)

      expect(result).toEqual(params)
    })

    test('Should throw error for invalid environment', () => {
      const params = { serviceId: 'service123', environment: 'invalidEnv' }

      expect(() => bucketParamsValidation(params, options)).toThrow(
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

      expect(() => bucketParamsValidation(params, options)).toThrow(
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

      expect(() => bucketParamsValidation(params, options)).toThrow(
        new Joi.ValidationError(
          '"environment" must be one of [dev, test, perf-test, prod]'
        )
      )
    })
  })
})
