import { redisController } from '~/src/server/redis/controller'

const redis = {
  plugin: {
    name: 'redis',
    register: (server) => {
      server.route({
        method: 'GET',
        path: '/redis-test',
        ...redisController
      })
    }
  }
}

export { redis }
