function provideTestType(topics = []) {
  switch (true) {
    case topics.includes('journey'):
      return 'Journey'
    case topics.includes('performance'):
      return 'Performance'
    default:
      return 'Test suite'
  }
}

export { provideTestType }
