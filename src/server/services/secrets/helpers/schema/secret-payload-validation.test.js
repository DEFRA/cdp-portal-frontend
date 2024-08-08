import Joi from 'joi'

import { secretPayloadValidation } from '~/src/server/services/secrets/helpers/schema/secret-payload-validation'
import { teamFixture } from '~/src/__fixtures__/team'

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
