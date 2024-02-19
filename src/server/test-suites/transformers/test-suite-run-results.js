import { buildS3PresignedUrl } from '~/src/server/common/helpers/aws/build-s3-presigned-url'

async function transformTestSuiteRunResults(testRun) {
  const presignedS3testResultsUrl = await buildS3PresignedUrl({
    region: 'eu-west-2',
    bucket: `cdp-${testRun.environment}-test-results`,
    key: `${testRun.testSuite}/${testRun.runId}/index.html`
  })

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
      url: presignedS3testResultsUrl,
      newWindow: true
    },
    { kind: 'date', value: testRun.created }
  ]
}

export { transformTestSuiteRunResults }
