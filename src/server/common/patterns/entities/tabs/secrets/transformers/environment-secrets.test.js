import { environmentSecrets } from '~/src/server/common/patterns/entities/tabs/secrets/transformers/environment-secrets.js'
import { serviceSecretsWithPendingFixture } from '~/src/__fixtures__/secrets/service-secrets.js'

describe('#environmentSecrets', () => {
  test('Should return expected environment secret transformation', () => {
    const result = environmentSecrets(serviceSecretsWithPendingFixture, [
      'REDIS_KEY_PREFIX'
    ])

    expect(result.serviceSecrets.keys).toEqual([
      {
        key: 'a_lower_case_secret',
        status: 'available'
      },
      {
        key: 'ANOTHER_SECRET',
        status: 'pending'
      },
      {
        key: 'SERVICE_SECRET',
        status: 'available'
      }
    ])
    expect(result.platformSecrets).toEqual([
      {
        description: 'Automatically generated Redis cache key prefix name.',
        key: 'REDIS_KEY_PREFIX'
      }
    ])
  })

  test('Should return pending secrets with status pending', () => {
    const secrets = { keys: ['KEY_1'], pending: ['KEY_2'] }
    const platformGlobalSecretKeys = []

    const result = environmentSecrets(secrets, platformGlobalSecretKeys)

    expect(result.serviceSecrets.keys).toEqual([
      { key: 'KEY_1', status: 'available' },
      { key: 'KEY_2', status: 'pending' }
    ])
  })

  describe('With pending secrets and no exception message', () => {
    test('Should return shouldPoll as true', () => {
      const secrets = { keys: ['KEY_1'], pending: ['KEY_2'] }
      const platformGlobalSecretKeys = []

      const result = environmentSecrets(secrets, platformGlobalSecretKeys)

      expect(result.shouldPoll).toBe(true)
    })
  })

  describe('With no pending secrets', () => {
    test('Should return shouldPoll as false', () => {
      const secrets = { keys: ['KEY_1'] }
      const platformGlobalSecretKeys = []

      const result = environmentSecrets(secrets, platformGlobalSecretKeys)

      expect(result.shouldPoll).toBe(false)
    })
  })

  describe('With no pending secrets and no exception message', () => {
    test('Should provide successMessage', () => {
      const secrets = { keys: ['KEY_1'] }
      const platformGlobalSecretKeys = []

      const result = environmentSecrets(secrets, platformGlobalSecretKeys)

      expect(result.successMessage).toBe('Secret added and now available')
    })
  })

  describe('With exception message', () => {
    test('Should return exceptionMessage', () => {
      const secrets = { keys: ['key1'], exceptionMessage: 'Error occurred' }
      const platformGlobalSecretKeys = []

      const result = environmentSecrets(secrets, platformGlobalSecretKeys)

      expect(result.exceptionMessage).toBe('Error occurred')
    })
  })

  test('Should return empty arrays if secrets is null', () => {
    const result = environmentSecrets(null, [])

    expect(result.serviceSecrets.keys).toEqual([])
    expect(result.platformSecrets).toEqual([])
  })

  test('Should return empty arrays if secrets.keys is undefined', () => {
    const secrets = {}
    const result = environmentSecrets(secrets, [])

    expect(result.serviceSecrets.keys).toEqual([])
    expect(result.platformSecrets).toEqual([])
  })
})
