import { config } from '~/src/config/config'
import { buildS3PresignedUrl } from '~/src/server/common/helpers/aws/build-s3-presigned-url'

const providePresignedUrl = {
  method: async function (request) {
    const { environment, serviceId, runId } = request.params
    return await buildS3PresignedUrl({
      region: config.get('awsRegion'),
      bucket: `cdp-${environment}-test-results`,
      key: `${serviceId}/${runId}/index.html`
    })
  },
  assign: 'presignedUrl'
}

export { providePresignedUrl }
