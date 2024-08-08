import Joi from 'joi'

import { secretParamsValidation } from '~/src/server/services/secrets/helpers/schema/secret-params-validation'

describe('#secretParamsValidation', () => {
  describe('With Admin user', () => {
    let options

    beforeEach(() => {
      options = {
        context: {
          app: {
            request: {
              service: {
                teams: [
                  {
                    github: 'cdp-platform',
                    teamId: 'aabe63e7-87ef-4beb-a596-c810631fc474',
                    name: 'Platform'
                  }
                ]
              }
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

  describe('With Non-admin user', () => {
    let options

    beforeEach(() => {
      options = {
        context: {
          app: {
            request: {
              service: {
                teams: [
                  {
                    github: 'bees',
                    teamId: '9e068bb9-1452-426e-a4ca-2e675a942a89',
                    name: 'Bees'
                  }
                ]
              }
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
