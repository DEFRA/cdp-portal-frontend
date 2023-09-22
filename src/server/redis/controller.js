import { createCluster } from 'redis'

import { appConfig } from '~/src/config'

const redisController = {
  handler: async (request, h) => {
    const cluster = await createCluster({
      rootNodes: [
        {
          url: `rediss://${appConfig.get('cacheUsername')}:${appConfig.get(
            'cachePassword'
          )}@${appConfig.get('cacheHost')}:6379`
        }
      ],
      useReplicas: true
    })

    cluster.on('error', (err) =>
      request.logger.info('Redis Cluster Error', err)
    )

    await cluster.connect()

    return h.response({ message: 'success' }).code(200)
  }
}

export { redisController }
