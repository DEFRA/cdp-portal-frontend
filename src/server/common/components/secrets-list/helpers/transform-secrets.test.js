import { transformSecrets } from './transform-secrets.js'
import { serviceSecretsFixture } from '../../../../../__fixtures__/secrets/service-secrets.js'

describe('#transformSecrets', () => {
  test('Should return keys excluding platform global keys', () => {
    const result = transformSecrets(
      { keys: ['TENANT_SECRET', 'OTHER_TENANT_SECRET', 'PLATFORM_SECRET'] },
      ['PLATFORM_SECRET']
    )

    expect(result.keys).toEqual(['OTHER_TENANT_SECRET', 'TENANT_SECRET'])
    expect(result.platformKeys).toEqual(['PLATFORM_SECRET'])
  })

  test('Should return keys excluding placeholders', () => {
    const result = transformSecrets(serviceSecretsFixture, ['REDIS_KEY_PREFIX'])

    expect(result.keys).toEqual(['a_lower_case_secret', 'SERVICE_SECRET'])
    expect(result.platformKeys).toEqual(['REDIS_KEY_PREFIX'])
  })

  test('Should return empty arrays if secrets is null', () => {
    const result = transformSecrets(null)
    expect(result.keys).toEqual([])
    expect(result.platformKeys).toEqual([])
  })

  test('Should return empty arrays if secrets.keys is undefined', () => {
    const result = transformSecrets({})
    expect(result.keys).toEqual([])
    expect(result.platformKeys).toEqual([])
  })

  test('Should return sorted keys', () => {
    const result = transformSecrets(serviceSecretsFixture, ['REDIS_KEY_PREFIX'])

    expect(result.keys).toEqual(['a_lower_case_secret', 'SERVICE_SECRET'])
    expect(result.platformKeys).toEqual(['REDIS_KEY_PREFIX'])
  })

  test('Should return lastChangedDate from secrets', () => {
    const result = transformSecrets(serviceSecretsFixture)
    expect(result.lastChangedDate).toBe('2024-08-02T16:02:23.9872730Z')
  })
})
