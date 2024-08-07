import { allEnvironmentSecrets } from '~/src/server/services/transformers/secrets/all-environment-secrets'
import { allEnvironmentSecretsFixture } from '~/src/__fixtures__/secrets/all-environment-secrets'
import { getEnvironments } from '~/src/server/common/helpers/environments/get-environments'

describe('#allEnvironmentSecrets', () => {
  describe('With an admin team', () => {
    test('Should return expected transformed secrets', () => {
      const result = allEnvironmentSecrets(
        getEnvironments(true),
        allEnvironmentSecretsFixture,
        ['REDIS_KEY_PREFIX']
      )

      expect(result).toEqual({
        dev: {
          createdDate: '2024-07-14T08:11:00',
          isSecretsSetup: true,
          keys: ['GOOGLE_APIS', 'OS_MAP_ENDPOINT'],
          lastChangedDate: '2024-08-02T16:08:35.2252690Z',
          platformKeys: ['REDIS_KEY_PREFIX']
        },
        'infra-dev': {
          createdDate: '2024-07-14T08:11:00',
          isSecretsSetup: true,
          keys: [
            'a_lower_case_secret',
            'EXAMPLE_SECRET',
            'SESSION_COOKIE_PASSWORD'
          ],
          lastChangedDate: '2024-08-05T09:48:49.4822540Z',
          platformKeys: ['REDIS_KEY_PREFIX']
        },
        management: {
          createdDate: '2024-07-14T08:11:00',
          isSecretsSetup: true,
          keys: ['AWESOME_SECRET'],
          lastChangedDate: '2024-08-02T16:02:23.9872730Z',
          platformKeys: ['REDIS_KEY_PREFIX']
        },
        'perf-test': {
          createdDate: null,
          isSecretsSetup: true,
          keys: [],
          lastChangedDate: null,
          platformKeys: []
        },
        prod: {
          createdDate: '2024-07-14T08:11:00',
          isSecretsSetup: true,
          keys: [],
          lastChangedDate: '2024-08-02T14:10:17.3880790Z',
          platformKeys: ['REDIS_KEY_PREFIX']
        },
        test: {
          createdDate: '2024-07-14T08:11:00',
          isSecretsSetup: true,
          keys: ['GOOGLE_APIS'],
          lastChangedDate: '2024-08-03T08:07:32.7548580Z',
          platformKeys: ['REDIS_KEY_PREFIX']
        }
      })
    })
  })

  describe('With a tenant team', () => {
    test('Should return expected transformed secrets', () => {
      const result = allEnvironmentSecrets(
        getEnvironments(false),
        allEnvironmentSecretsFixture,
        ['REDIS_KEY_PREFIX']
      )

      expect(result).toEqual({
        dev: {
          createdDate: '2024-07-14T08:11:00',
          isSecretsSetup: true,
          keys: ['GOOGLE_APIS', 'OS_MAP_ENDPOINT'],
          lastChangedDate: '2024-08-02T16:08:35.2252690Z',
          platformKeys: ['REDIS_KEY_PREFIX']
        },
        'perf-test': {
          createdDate: null,
          isSecretsSetup: true,
          keys: [],
          lastChangedDate: null,
          platformKeys: []
        },
        prod: {
          createdDate: '2024-07-14T08:11:00',
          isSecretsSetup: true,
          keys: [],
          lastChangedDate: '2024-08-02T14:10:17.3880790Z',
          platformKeys: ['REDIS_KEY_PREFIX']
        },
        test: {
          createdDate: '2024-07-14T08:11:00',
          isSecretsSetup: true,
          keys: ['GOOGLE_APIS'],
          lastChangedDate: '2024-08-03T08:07:32.7548580Z',
          platformKeys: ['REDIS_KEY_PREFIX']
        }
      })
    })
  })

  test('Should return expected object for environments with no secrets', () => {
    const environments = { dev: 'dev', prod: 'prod' }
    const allSecrets = { dev: null, prod: null }

    const result = allEnvironmentSecrets(environments, allSecrets)

    expect(result.dev).toEqual({
      isSecretsSetup: false
    })
    expect(result.prod).toEqual({
      isSecretsSetup: false
    })
  })

  test('Should return empty keys and platformKeys if secrets.keys is undefined', () => {
    const environments = { dev: 'dev' }
    const allSecrets = { dev: {} }

    const result = allEnvironmentSecrets(environments, allSecrets)

    expect(result.dev.keys).toEqual([])
    expect(result.dev.platformKeys).toEqual([])
  })

  test('Should return sorted platform keys that are present in secrets', () => {
    const environments = { dev: 'dev' }
    const allSecrets = {
      dev: {
        keys: ['TENANT_SECRET', 'REDIS_KEY_PREFIX', 'ANOTHER_TENANT_SECRET']
      }
    }

    const result = allEnvironmentSecrets(environments, allSecrets, [
      'REDIS_KEY_PREFIX'
    ])

    expect(result.dev.platformKeys).toEqual(['REDIS_KEY_PREFIX'])
  })

  test('handles multiple environments correctly', () => {
    const environments = { dev: 'dev', prod: 'prod' }
    const allSecrets = {
      dev: { keys: ['TENANT_SECRET', 'REDIS_KEY_PREFIX'] },
      prod: { keys: ['TENANT_SECRET', 'REDIS_KEY_PREFIX'] }
    }

    const result = allEnvironmentSecrets(environments, allSecrets)

    expect(result.dev.keys).toEqual(['TENANT_SECRET'])
    expect(result.dev.platformKeys).toEqual(['REDIS_KEY_PREFIX'])

    expect(result.prod.keys).toEqual(['TENANT_SECRET'])
    expect(result.prod.platformKeys).toEqual(['REDIS_KEY_PREFIX'])
  })
})
