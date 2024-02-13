function buildS3Url({ environment, testSuite, runId }) {
  return `https://s3.console.aws.amazon.com/s3/buckets/cdp-${environment}-test-results?region=eu-west-2&bucketType=general&prefix=${testSuite}/${runId}/&showversions=false`
}

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
      url: buildS3Url(testRun),
      newWindow: true
    },
    { kind: 'date', value: testRun.created }
  ]
}

export { transformTestSuiteRunResults }
