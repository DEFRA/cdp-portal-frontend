import { omit } from 'lodash'

function decorateService(service, repository) {
  return omit(
    {
      ...service,
      ...repository
    },
    ['url']
  )
}

export { decorateService }
