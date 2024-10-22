function testTypeDecorator(testSuite) {
  let testType
  if (testSuite.topics.includes('environment')) {
    testType = 'Environment'
  } else if (testSuite.topics.includes('smoke')) {
    testType = 'Smoke'
  } else if (testSuite.topics.includes('performance')) {
    testType = 'Performance'
  } else if (testSuite.topics.includes('journey')) {
    testType = 'Journey'
  } else {
    return testSuite
  }

  return {
    ...testSuite,
    testType
  }
}

export { testTypeDecorator }
