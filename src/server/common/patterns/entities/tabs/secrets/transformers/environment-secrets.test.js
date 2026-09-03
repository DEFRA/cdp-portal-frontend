import { environmentSecrets } from './environment-secrets.js'
import { serviceSecretsFixture } from '../../../../../../../__fixtures__/secrets/service-secrets.js'

describe('#environmentSecrets', () => {
  test('Should return expected environment secret transformation', () => {
    const result = environmentSecrets(serviceSecretsFixture, [
      'REDIS_KEY_PREFIX'
    ])

    expect(result.serviceSecrets.keys).toEqual([
      {
        key: 'a_lower_case_secret',
        status: 'available'
      },
      {
        key: 'SERVICE_SECRET',
        status: 'available'
      }
    ])
    expect(result.platformSecrets).toEqual([
      {
        description: 'Automatically generated Redis cache key prefix name',
        key: 'REDIS_KEY_PREFIX'
      }
    ])
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
