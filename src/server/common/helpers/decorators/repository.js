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
      ...(repository ?? {}),
      ...(tenantServices && { tenantServices }),
      ...(meta ?? {})
    },
    ['url']
  )
}

export { repositoryDecorator }
