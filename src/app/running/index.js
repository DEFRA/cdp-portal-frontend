import { runningListController } from '~/src/app/running/controllers'

const running = {
  plugin: {
    name: 'running',
    register: async (server) => {
      server.route([
        {
          method: 'GET',
          path: '/running',
          handler: runningListController.handler
        }
      ])
    }
  }
}

export { running }
