import Joi from 'joi'
import { launchTerminalParamsValidation } from '~/src/server/services/terminal/helpers/schema/launch-terminal-params-validation.js'

describe('#launchTerminalParamsValidation', () => {
  describe('With breakglass user', () => {
    let options

    beforeEach(() => {
      options = {
        context: {
          auth: {
            credentials: {
              scope: ['breakglass']
            }
          }
        }
      }
    })

    test('Should throw expected error for missing environment', () => {
      const params = { serviceId: 'service123' }

      expect(() => launchTerminalParamsValidation(params, options)).toThrow(
        new Joi.ValidationError('"environment" is required')
      )
    })

    test('Should throw expected error for invalid serviceId pattern', () => {
      const params = { environment: 'dev' }

      expect(() => launchTerminalParamsValidation(params, options)).toThrow(
        new Joi.ValidationError('"serviceId" is required')
      )
    })

    test('Should allow for prod and return expected validated params', () => {
      const params = { serviceId: 'service123', environment: 'prod' }
      const result = launchTerminalParamsValidation(params, options)

      expect(result).toEqual(params)
    })

    test('Should throw error for invalid environment', () => {
      const params = { serviceId: 'service123', environment: 'invalidEnv' }

      expect(() => launchTerminalParamsValidation(params, options)).toThrow(
        new Joi.ValidationError(
          '"environment" must be one of [dev, test, perf-test, prod]'
        )
      )
    })
  })

  describe('With Non-breakglass user', () => {
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

    test('Should throw error for prod environment', () => {
      const params = { serviceId: 'service123', environment: 'prod' }

      expect(() => launchTerminalParamsValidation(params, options)).toThrow(
        new Joi.ValidationError(
          '"environment" must be one of [dev, test, perf-test]'
        )
      )
    })

    test('Should throw error for invalid environment', () => {
      const params = { serviceId: 'service123', environment: 'management' }

      expect(() => launchTerminalParamsValidation(params, options)).toThrow(
        new Joi.ValidationError(
          '"environment" must be one of [dev, test, perf-test]'
        )
      )
    })
  })
})
