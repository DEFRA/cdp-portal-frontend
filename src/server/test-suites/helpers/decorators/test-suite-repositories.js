function testSuiteRepositoriesDecorator(decorateRepositories) {
  return function addDetail({ testSuite, lastRun }) {
    return {
      ...decorateRepositories(testSuite),
      lastRun
    }
  }
}

export { testSuiteRepositoriesDecorator }
