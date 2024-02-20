function transformTestSuiteRunResults(testRun) {
  return [
    {
      kind: 'text',
      value: testRun.user.displayName
    },
    {
      kind: 'text',
      value: testRun.environment
    },
    {
      kind: 'link',
      value: 'Run report',
      url: `/test-suites/test-results/${testRun.environment}/${testRun.testSuite}/${testRun.runId}`,
      newWindow: true
    },
    { kind: 'date', value: testRun.created }
  ]
}

export { transformTestSuiteRunResults }
