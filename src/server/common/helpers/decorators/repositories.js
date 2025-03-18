import { repositoryDecorator } from '~/src/server/common/helpers/decorators/repository.js'

function repositoriesDecorator(repositories) {
  return (service) => {
    let repository

    if (service.serviceName) {
      repository = repositories.find(
        (repo) => repo?.id.toLowerCase() === service.serviceName.toLowerCase()
      )
    }

    return repositoryDecorator(service, repository)
  }
}

export { repositoriesDecorator }
