import { commonServiceExtensions } from '#server/common/helpers/ext/extensions.js'
import Boom from '@hapi/boom'
import { resolve, join, sep } from 'node:path/posix'

export const ext = [...commonServiceExtensions]

export const options = {
  id: 'services/{serviceId}/files'
}

export default async function (request, h) {
  const { path = '' } = request.params
  const entity = request.app.entity

  const serviceBasePath = join('/uploads', entity.name) // TODO: Use actual S3 path
  const fsPath = join(resolve(serviceBasePath, path), sep)

  // Protect against path traversal attack
  if (!fsPath.startsWith(serviceBasePath + sep)) {
    return Boom.boomify(Boom.badRequest('Invalid path'))
  }


  return {
    entity,
    fsPath,
    breadcrumbs: [
      {
        text: 'Services',
        href: '/services'
      },
      {
        text: entity.name,
        href: `/services/${entity.name}`
      },
      {
        text: 'Files'
      }
    ]
  }
}
