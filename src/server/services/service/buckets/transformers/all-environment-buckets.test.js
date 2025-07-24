import { describe, expect, test } from 'vitest'
import { allEnvironmentBuckets } from './all-environment-buckets.js'
import { allEnvironmentBucketsFixture } from '../../../../../__fixtures__/buckets/all-environment-buckets.js'
import { getEnvironments } from '../../../../common/helpers/environments/get-environments.js'
import { scopes } from '../../../../common/constants/scopes.js'

describe('#allEnvironmentBuckets', () => {
  describe('With an admin team', () => {
    test('Should return expected transformed buckets', () => {
      const result = allEnvironmentBuckets(
        getEnvironments([scopes.admin, scopes.externalTest]),
        allEnvironmentBucketsFixture
      )

      expect(result).toEqual({
        'infra-dev': {
          isBucketsSetup: true,
          buckets: ['a_lower_case_bucket', 'EXAMPLE_BUCKET', 'z_ordered_bucket']
        },
        management: {
          isBucketsSetup: true,
          buckets: ['AWESOME_BUCKET']
        },
        dev: {
          isBucketsSetup: true,
          buckets: ['AWESOME_BUCKET']
        },
        test: {
          isBucketsSetup: true,
          buckets: ['AWESOME_BUCKET']
        },
        'perf-test': {
          isBucketsSetup: true,
          buckets: []
        },
        'ext-test': {
          isBucketsSetup: true,
          buckets: []
        },
        prod: {
          isBucketsSetup: true,
          buckets: ['AWESOME_BUCKET']
        }
      })
    })
  })

  describe('With a tenant team', () => {
    test('Should return expected transformed buckets', () => {
      const result = allEnvironmentBuckets(
        getEnvironments([]),
        allEnvironmentBucketsFixture
      )

      expect(result).toEqual({
        dev: {
          isBucketsSetup: true,
          buckets: ['AWESOME_BUCKET']
        },
        test: {
          isBucketsSetup: true,
          buckets: ['AWESOME_BUCKET']
        },
        'perf-test': {
          isBucketsSetup: true,
          buckets: []
        },
        prod: {
          isBucketsSetup: true,
          buckets: ['AWESOME_BUCKET']
        }
      })
    })
  })

  describe('With a tenant team with access to externalTest', () => {
    test('Should return expected transformed buckets', () => {
      const result = allEnvironmentBuckets(
        getEnvironments([scopes.externalTest]),
        allEnvironmentBucketsFixture
      )

      expect(result).toEqual({
        dev: {
          isBucketsSetup: true,
          buckets: ['AWESOME_BUCKET']
        },
        test: {
          isBucketsSetup: true,
          buckets: ['AWESOME_BUCKET']
        },
        'perf-test': {
          isBucketsSetup: true,
          buckets: []
        },
        'ext-test': {
          isBucketsSetup: true,
          buckets: []
        },
        prod: {
          isBucketsSetup: true,
          buckets: ['AWESOME_BUCKET']
        }
      })
    })
  })

  test('Should return expected object for environments with no buckets', () => {
    const environments = ['dev', 'prod']
    const allBuckets = { dev: null, prod: null }

    const result = allEnvironmentBuckets(environments, allBuckets)

    expect(result.dev).toEqual({
      isBucketsSetup: false
    })
    expect(result.prod).toEqual({
      isBucketsSetup: false
    })
  })

  test('Should return no buckets list if buckets is empty', () => {
    const environments = ['dev']
    const allBuckets = { dev: {} }

    const result = allEnvironmentBuckets(environments, allBuckets)

    expect(result.dev.buckets).toEqual([])
  })

  test('handles multiple environments correctly', () => {
    const environments = ['dev', 'prod']
    const allBuckets = {
      dev: { buckets: ['TENANT_BUCKET'] },
      prod: { buckets: ['TENANT_BUCKET'] }
    }

    const result = allEnvironmentBuckets(environments, allBuckets)

    expect(result.dev.buckets).toEqual(['TENANT_BUCKET'])

    expect(result.prod.buckets).toEqual(['TENANT_BUCKET'])
  })
})
