const order = ['infra-dev', 'management', 'dev', 'test', 'perf-test', 'prod']

const sortByEnv = (a, b) => {
  return order.indexOf(a) - order.indexOf(b)
}

export { sortByEnv }
