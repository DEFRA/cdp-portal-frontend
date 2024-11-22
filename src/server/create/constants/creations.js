const creations = {
  microservice: {
    kind: 'microservice',
    title: 'Microservice',
    hint: 'A loosely coupled service that can be deployed independently and is responsible for a single business capability'
  },
  'journey-test-suite': {
    kind: 'journey-test-suite',
    title: 'Journey Test Suite',
    hint: 'A collection of tests that verify the user journeys within a microservice'
  },
  'perf-test-suite': {
    kind: 'perf-test-suite',
    title: 'Performance Test Suite',
    hint: 'A collection of tests that verify the performance of a microservice'
  },
  repository: {
    kind: 'repository',
    title: 'Repository',
    hint: 'A container for a collection of files that are versioned and stored in DEFRA GitHub'
  }
}

export { creations }
