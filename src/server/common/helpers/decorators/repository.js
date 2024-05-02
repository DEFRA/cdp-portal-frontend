import { omit } from 'lodash'

function repositoryDecorator(service, repository) {
  return omit(
    {
      ...service,
      ...(repository && repository)
    },
    ['url']
  )
}

export { repositoryDecorator }
