import { omit } from 'lodash'

function decorateServices(repositories) {
  return function addDetail(service) {
    const repositoryDetail = repositories.find(
      (repository) =>
        repository.url.toLowerCase() === service.githubUrl.toLowerCase()
    )

    return omit(
      {
        ...service,
        ...(repositoryDetail && repositoryDetail)
      },
      ['url']
    )
  }
}

export { decorateServices }