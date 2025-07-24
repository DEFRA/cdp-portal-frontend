import { describe, expect, test } from 'vitest'
import { sortByEnv } from './sort-by-env.js'

describe('#sortByEnv', () => {
  const unOrderedEnvs = [
    'management',
    'prod',
    'dev',
    'perf-test',
    'infra-dev',
    'test'
  ]

  test('Should provide expected sorting', () => {
    expect(unOrderedEnvs.sort(sortByEnv)).toEqual([
      'infra-dev',
      'management',
      'dev',
      'test',
      'perf-test',
      'prod'
    ])
  })
})
