import Joi from 'joi'

import {
  secretPayloadValidation,
  secretParamsValidation
} from '~/src/server/services/secrets/helpers/schema/secret-validation'
import { teamFixture } from '~/src/__fixtures__/team'

describe('#secretValidation', () => {
  describe('#secretPayloadValidation', () => {
    const mockTenantTeamId = '087d4a80-002b-48cf-a7d3-aa60b67784f0'

    describe('With tenant team', () => {
      test('Should validate payload for create action with valid data', () => {
        const action = 'create'
        const existingSecretKeys = ['existingKey']
        const payload = {
          secretKey: 'newSecretKey',
          secretValue: 'newSecretValue',
          teamId: mockTenantTeamId,
          environment: 'dev',
          button: 'create'
        }

        const schema = secretPayloadValidation(
          action,
          mockTenantTeamId,
          existingSecretKeys
        )
        const { error } = schema.validate(payload)

        expect(error).toBeUndefined()
      })

      test('Should validate payload for update action with valid data', () => {
        const action = 'update'
        const existingSecretKeys = ['existingKey']
        const payload = {
          secretKey: 'existingKey',
          secretValue: 'updatedSecretValue',
          teamId: mockTenantTeamId,
          environment: 'dev',
          button: 'update'
        }

        const schema = secretPayloadValidation(
          action,
          mockTenantTeamId,
          existingSecretKeys
        )
        const { error } = schema.validate(payload)

        expect(error).toBeUndefined()
      })

      test('Should provide error for invalid secretKeys', () => {
        const action = 'create'
        const existingSecretKeys = ['existingKey']
        const payload = {
          secretKey: 'invalid key!',
          secretValue: 'newSecretValue',
          teamId: mockTenantTeamId,
          environment: 'dev',
          button: 'create'
        }

        const schema = secretPayloadValidation(
          action,
          mockTenantTeamId,
          existingSecretKeys
        )
        const { error } = schema.validate(payload)

        expect(error).toBeInstanceOf(Joi.ValidationError)
        expect(error.message).toEqual(
          'Any case letters and numbers with underscore separators'
        )
      })

      test('Should provide error for invalid immutable keys', () => {
        const action = 'create'
        const existingSecretKeys = ['existingKey']
        const payload = {
          secretKey: 'REDIS_KEY_PREFIX',
          secretValue: 'newSecretValue',
          teamId: mockTenantTeamId,
          environment: 'dev',
          button: 'create'
        }

        const schema = secretPayloadValidation(
          action,
          mockTenantTeamId,
          existingSecretKeys
        )
        const { error } = schema.validate(payload)

        expect(error).toBeInstanceOf(Joi.ValidationError)
        expect(error.message).toEqual('Platform secrets cannot be changed')
      })

      test('Should return error for disallowed secretKey', () => {
        const action = 'create'
        const existingSecretKeys = ['existingKey']
        const payload = {
          secretKey: 'existingKey',
          secretValue: 'newSecretValue',
          teamId: mockTenantTeamId,
          environment: 'dev',
          button: 'create'
        }

        const schema = secretPayloadValidation(
          action,
          mockTenantTeamId,
          existingSecretKeys
        )
        const { error } = schema.validate(payload)

        expect(error).toBeInstanceOf(Joi.ValidationError)
        expect(error.message).toEqual('Key already exists')
      })

      test('Should return error for invalid environment', () => {
        const action = 'create'
        const existingSecretKeys = ['existingKey']
        const payload = {
          secretKey: 'newSecretKey',
          secretValue: 'newSecretValue',
          teamId: mockTenantTeamId,
          environment: 'management',
          button: 'create'
        }

        const schema = secretPayloadValidation(
          action,
          mockTenantTeamId,
          existingSecretKeys
        )
        const { error } = schema.validate(payload)

        expect(error).toBeInstanceOf(Joi.ValidationError)
        expect(error.message).toEqual('Choose an environment')
      })
    })

    describe('With admin team', () => {
      test('Should return error for invalid environment', () => {
        const action = 'create'
        const existingSecretKeys = ['existingKey']
        const payload = {
          secretKey: 'newSecretKey',
          secretValue: 'newSecretValue',
          teamId: teamFixture.teamId,
          environment: 'invalidEnv',
          button: 'create'
        }

        const schema = secretPayloadValidation(
          action,
          teamFixture.teamId,
          existingSecretKeys
        )
        const { error } = schema.validate(payload)

        expect(error).toBeInstanceOf(Joi.ValidationError)
        expect(error.message).toEqual('Choose an environment')
      })
    })
  })

  describe('#secretParamsValidation', () => {
    test('Should throw expected error for missing environment', () => {
      const params = { serviceId: 'service123' }
      const options = { context: { auth: { credentials: { isAdmin: true } } } }

      expect(() => secretParamsValidation(params, options)).toThrow(
        new Joi.ValidationError('"environment" is required')
      )
    })

    test('Should throw expected error for invalid serviceId pattern', () => {
      const params = { environment: 'dev' }
      const options = { context: { auth: { credentials: { isAdmin: true } } } }

      expect(() => secretParamsValidation(params, options)).toThrow(
        new Joi.ValidationError('"serviceId" is required')
      )
    })

    describe('With Admin user', () => {
      const options = { context: { auth: { credentials: { isAdmin: true } } } }

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
      test('Should throw error for invalid environment', () => {
        const params = { serviceId: 'service123', environment: 'management' }
        const options = {
          context: { auth: { credentials: { isAdmin: false } } }
        }

        expect(() => secretParamsValidation(params, options)).toThrow(
          new Joi.ValidationError(
            '"environment" must be one of [dev, test, perf-test, prod]'
          )
        )
      })
    })
  })
})
