const order = [
  'infra-dev',
  'management',
  'dev',
  'test',
  'perf-test',
  'ext-test',
  'prod'
]

const sortByEnv = (a, b) => order.indexOf(a) - order.indexOf(b)

export { sortByEnv }
