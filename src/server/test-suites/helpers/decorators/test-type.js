function topicToTestType(topics) {
  if (topics.includes('environment')) {
    return 'Environment'
  } else if (topics.includes('smoke')) {
    return 'Smoke'
  } else if (topics.includes('performance')) {
    return 'Performance'
  } else if (topics.includes('journey')) {
    return 'Journey'
  } else {
    return undefined
  }
}

function testTypeDecorator(testSuite) {
  const testType = topicToTestType(testSuite.topics)
  return {
    ...testSuite,
    testType
  }
}

export { testTypeDecorator }
