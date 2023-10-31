import { omit } from 'lodash'

function decorateServiceWithGithubDetail(service, repository) {
  return omit(
    {
      ...service,
      ...repository
    },
    ['url']
  )
}

export { decorateServiceWithGithubDetail }
