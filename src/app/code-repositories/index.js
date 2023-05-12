import {
  codeRepositoryController,
  codeRepositoryListController
} from '~/src/app/code-repositories/controllers'

const codeRepositories = {
  plugin: {
    name: 'Code repositories',
    register: async (server) => {
      server.route([
        {
          method: 'GET',
          path: '/code-repositories',
          ...codeRepositoryListController
        },
        {
          method: 'GET',
          path: '/code-repositories/{codeRepositoryId}',
          ...codeRepositoryController
        }
      ])
    }
  }
}

export { codeRepositories }
