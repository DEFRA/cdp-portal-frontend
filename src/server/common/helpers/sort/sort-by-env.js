const order = ['management', 'infra-dev', 'dev', 'test', 'perf-test', 'prod']

const sortByEnv = (a, b) => {
  return order.indexOf(a) - order.indexOf(b)
}

export { sortByEnv }
