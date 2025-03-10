import Joi from 'joi'
import { terminalBrowserParamsValidation } from '~/src/server/services/service/terminal/helpers/schema/terminal-browser-params-validation.js'
import { scopes } from '~/src/server/common/constants/scopes.js'

describe('#terminalBrowserParamsValidation', () => {
  describe('With break glass user', () => {
    let options

    beforeEach(() => {
      options = {
        context: {
          auth: {
            credentials: {
              scope: [scopes.breakGlass]
            }
          }
        }
      }
    })

    test('Should throw expected error for missing environment', () => {
      const params = { serviceId: 'service123', token: 'abc123' }

      expect(() => terminalBrowserParamsValidation(params, options)).toThrow(
        new Joi.ValidationError('"environment" is required')
      )
    })

    test('Should throw expected error for invalid serviceId pattern', () => {
      const params = { environment: 'dev', token: 'abc123' }

      expect(() => terminalBrowserParamsValidation(params, options)).toThrow(
        new Joi.ValidationError('"serviceId" is required')
      )
    })

    test('Should throw expected error for missing token pattern', () => {
      const params = { environment: 'dev', serviceId: 'serviceId' }

      expect(() => terminalBrowserParamsValidation(params, options)).toThrow(
        new Joi.ValidationError('"token" is required')
      )
    })

    test('Should allow for prod and return expected validated params', () => {
      const params = {
        serviceId: 'service123',
        environment: 'prod',
        token: 'abc123'
      }
      const result = terminalBrowserParamsValidation(params, options)

      expect(result).toEqual(params)
    })

    test('Should throw error for invalid environment', () => {
      const params = {
        serviceId: 'service123',
        environment: 'invalidEnv',
        token: 'abc123'
      }

      expect(() => terminalBrowserParamsValidation(params, options)).toThrow(
        new Joi.ValidationError(
          '"environment" must be one of [dev, test, perf-test, prod]'
        )
      )
    })
  })

  describe('With Non break glass user', () => {
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
      const params = {
        serviceId: 'service123',
        environment: 'prod',
        token: 'abc123'
      }

      expect(() => terminalBrowserParamsValidation(params, options)).toThrow(
        new Joi.ValidationError(
          '"environment" must be one of [dev, test, perf-test]'
        )
      )
    })

    test('Should throw error for invalid environment', () => {
      const params = {
        serviceId: 'service123',
        environment: 'management',
        token: 'abc123'
      }

      expect(() => terminalBrowserParamsValidation(params, options)).toThrow(
        new Joi.ValidationError(
          '"environment" must be one of [dev, test, perf-test]'
        )
      )
    })

    test('Should allow for env and return expected validated params', () => {
      const params = {
        serviceId: 'service123',
        environment: 'dev',
        token: 'abc123'
      }
      const result = terminalBrowserParamsValidation(params, options)

      expect(result).toEqual(params)
    })
  })

  describe('With Admin user', () => {
    let options

    beforeEach(() => {
      options = {
        context: {
          auth: {
            credentials: {
              scope: [scopes.admin]
            }
          }
        }
      }
    })

    test('Should throw error for prod environment', () => {
      const params = {
        serviceId: 'service123',
        environment: 'prod',
        token: 'abc123'
      }

      expect(() => terminalBrowserParamsValidation(params, options)).toThrow(
        new Joi.ValidationError(
          '"environment" must be one of [infra-dev, management, dev, test, perf-test]'
        )
      )
    })

    test('Should throw error for invalid environment', () => {
      const params = {
        serviceId: 'service123',
        environment: 'not-an-env',
        token: 'abc123'
      }

      expect(() => terminalBrowserParamsValidation(params, options)).toThrow(
        new Joi.ValidationError(
          '"environment" must be one of [infra-dev, management, dev, test, perf-test]'
        )
      )
    })

    test('Should allow for env and return expected validated params', () => {
      const params = {
        serviceId: 'service123',
        environment: 'infra-dev',
        token: 'abc123'
      }
      const result = terminalBrowserParamsValidation(params, options)

      expect(result).toEqual(params)
    })
  })
})
