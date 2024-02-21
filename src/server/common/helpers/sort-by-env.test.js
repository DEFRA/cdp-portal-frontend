import { sortByEnv } from '~/src/server/common/helpers/sort-by-env'

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
      'management',
      'infra-dev',
      'dev',
      'test',
      'perf-test',
      'prod'
    ])
  })
})
