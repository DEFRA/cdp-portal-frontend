import { S3Client } from '@aws-sdk/client-s3'

/**
 * @satisfies {Plugin}
 */
const s3Client = {
  name: 's3Client',
  version: '0.1.0',
  register(server, options) {
    const client = new S3Client({
      region: options.region,
      endpoint: options.endpoint,
      forcePathStyle: options.forcePathStyle
    })

    server.decorate('request', 's3Client', client)
    server.decorate('server', 's3Client', client)

    server.events.on('stop', () => {
      server.logger.info('Closing S3 client')
      client.destroy()
    })
  }
}

export { s3Client }

/**
 * @import { Server, Plugin } from '@hapi/hapi'
 */
