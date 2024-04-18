import { omit } from 'lodash'

function repositoryDecorator(service, repository) {
  return omit(
    {
      ...(repository && repository),
      ...service
    },
    ['url']
  )
}

export { repositoryDecorator }
