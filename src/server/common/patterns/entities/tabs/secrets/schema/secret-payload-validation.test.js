import Joi from 'joi'

import {
  secretPayloadValidation,
  removeSecretPayloadValidation
} from './secret-payload-validation.js'

describe('#secretPayloadValidation', () => {
  describe('secretPayloadValidation', () => {
    test('Should validate payload for create action with valid data', () => {
      const action = 'create'
      const existingSecretKeys = ['existingKey']
      const payload = {
        secretKey: 'newSecretKey',
        secretValue: 'newSecretValue',
        button: 'create'
      }

      const schema = secretPayloadValidation(action, existingSecretKeys)
      const { error } = schema.validate(payload)

      expect(error).toBeUndefined()
    })

    test('Should validate payload for update action with valid data', () => {
      const action = 'update'
      const existingSecretKeys = ['existingKey']
      const payload = {
        secretKey: 'existingKey',
        secretValue: 'updatedSecretValue',
        button: 'update'
      }

      const schema = secretPayloadValidation(action, existingSecretKeys)
      const { error } = schema.validate(payload)

      expect(error).toBeUndefined()
    })

    test('Should provide error for invalid secretKeys', () => {
      const action = 'create'
      const existingSecretKeys = ['existingKey']
      const payload = {
        secretKey: 'invalid key!',
        secretValue: 'newSecretValue',
        button: action
      }

      const schema = secretPayloadValidation(action, existingSecretKeys)
      const { error } = schema.validate(payload)

      expect(error).toBeInstanceOf(Joi.ValidationError)
      expect(error.message).toBe(
        'Any case letters and numbers with underscore separators'
      )
    })

    test('Should provide error for non-existent key', () => {
      const action = 'update'
      const existingSecretKeys = ['existingKey']
      const payload = {
        secretKey: 'newKey',
        secretValue: 'newSecretValue',
        button: action
      }

      const schema = secretPayloadValidation(action, existingSecretKeys)
      const { error } = schema.validate(payload)

      expect(error).toBeInstanceOf(Joi.ValidationError)
      expect(error.message).toBe('"secretKey" must be [existingKey]')
    })

    test('Should provide error for invalid immutable keys', () => {
      const action = 'create'
      const existingSecretKeys = ['existingKey']
      const payload = {
        secretKey: 'REDIS_KEY_PREFIX',
        secretValue: 'newSecretValue',
        button: action
      }

      const schema = secretPayloadValidation(action, existingSecretKeys)
      const { error } = schema.validate(payload)

      expect(error).toBeInstanceOf(Joi.ValidationError)
      expect(error.message).toBe('Platform secrets cannot be changed')
    })

    test('Should return error for existing secretKey', () => {
      const action = 'create'
      const existingSecretKeys = ['existingKey']
      const payload = {
        secretKey: 'existingKey',
        secretValue: 'newSecretValue',
        button: action
      }

      const schema = secretPayloadValidation(action, existingSecretKeys)
      const { error } = schema.validate(payload)

      expect(error).toBeInstanceOf(Joi.ValidationError)
      expect(error.message).toBe('Key already exists')
    })
  })

  describe('removeSecretKeyValidation', () => {
    test('Should validate payload with valid data', () => {
      const payload = {
        secretKey: 'existingKey'
      }
      const { error } = removeSecretPayloadValidation(['existingKey']).validate(
        payload
      )

      expect(error).toBeUndefined()
    })

    test('Should error when trying to delete non-existent key', () => {
      const payload = {
        secretKey: 'unknownKey'
      }
      const { error } = removeSecretPayloadValidation(['existingKey']).validate(
        payload
      )

      expect(error).toBeInstanceOf(Joi.ValidationError)
      expect(error.message).toBe('"secretKey" must be [existingKey]')
    })
  })
})
