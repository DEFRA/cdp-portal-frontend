import { repositoryDecorator } from '~/src/server/common/helpers/decorators/repository.js'

function repositoriesDecorator(repositories) {
  return function addDetail(service) {
    let repository

    if (service.githubUrl) {
      repository = repositories.find(
        (repo) => repo?.url?.toLowerCase() === service.githubUrl.toLowerCase()
      )
    }

    return repositoryDecorator(service, repository)
  }
}

export { repositoriesDecorator }
