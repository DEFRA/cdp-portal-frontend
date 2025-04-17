import omit from 'lodash/omit.js'

function repositoryDecorator(
  service,
  repository = null,
  tenantServices = null,
  meta = null
) {
  return omit(
    {
      ...service,
      ...(repository && repository),
      ...(tenantServices && { tenantServices }),
      ...(meta && meta)
    },
    ['url']
  )
}

export { repositoryDecorator }
