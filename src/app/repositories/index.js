import {
  repositoryController,
  repositoryListController
} from '~/src/app/repositories/controllers'

const repositories = {
  plugin: {
    name: 'repositories',
    register: async (server) => {
      server.route([
        {
          method: 'GET',
          path: '/repositories',
          handler: repositoryListController.handler
        },
        {
          method: 'GET',
          path: '/repositories/{repositoryId}',
          handler: repositoryController.handler
        }
      ])
    }
  }
}

export { repositories }
