import { omit } from 'lodash'

function decorateServices(repositories) {
  return function addDetail(service) {
    const repositoryDetail = repositories.find(
      (repository) => repository.url === service.githubUrl
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
