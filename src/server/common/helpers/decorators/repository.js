import omit from 'lodash/omit.js'

function repositoryDecorator(service, repository = {}) {
  return omit(
    {
      ...service,
      ...repository
    },
    ['url']
  )
}

export { repositoryDecorator }
