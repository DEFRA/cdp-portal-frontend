import { buildS3PresignedUrl } from '~/src/server/common/helpers/aws/build-s3-presigned-url'
import { config } from 'date-fns/docs/config'

async function transformTestSuiteRunResults(testRun) {
  const presignedS3testResultsUrl = await buildS3PresignedUrl({
    region: config.get('awsRegion'),
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
