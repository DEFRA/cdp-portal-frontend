import { omit } from 'lodash'

function decorateServicesWithGithubDetail(repositories) {
  return function addGithubDetail(service) {
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

export { decorateServicesWithGithubDetail }
