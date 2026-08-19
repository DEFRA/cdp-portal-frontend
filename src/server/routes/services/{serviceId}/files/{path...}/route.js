import { commonServiceExtensions } from '#server/common/helpers/ext/extensions.js'
import Boom from '@hapi/boom'
import { resolve, join, sep } from 'node:path/posix'

export const ext = [...commonServiceExtensions]

export const options = {
  id: 'services/{serviceId}/files'
}

const data = [
  {
    name: 'cdp-portal-bakcend',
    type: 'directory',
    created: '2026-07-04:09:45:34',
    modified: '2026-07-04:09:45:34',
    items: [
      {
        name: 'migrations',
        type: 'directory',
        created: '2026-07-04:09:45:34',
        modified: '2026-07-04:09:45:34',
        items: [
          {
            name: 'my-file.json',
            type: 'file',
            size: '12500',
            created: '2026-07-04:10:35:43',
            modified: '2026-07-08:13:42:42'
          }
        ]
      }
    ]
  }
]

export default async function (request, h) {
  const { path = '' } = request.params
  const entity = request.app.entity

  const serviceBasePath = join('/uploads', entity.name) // TODO: Use actual S3 path
  const fsPath = join(resolve(serviceBasePath, path), sep)

  // Protect against path traversal attack
  if (!fsPath.startsWith(serviceBasePath + sep)) {
    return Boom.boomify(Boom.badRequest('Invalid path'))
  }

  const relativePathParts = [
    '/',
    ...fsPath
      .replace(serviceBasePath, '')
      .split('/')
      .filter((seg) => seg !== '')
  ]

  console.log(relativePathParts)

  return {
    entity,
    relativePathParts,
    breadcrumbs: [
      {
        text: 'Services',
        href: '/services'
      },
      {
        text: entity.name,
        href: `/services/${entity.name}`
      },
      ...buildFsBreadcrumbs(entity, relativePathParts)
    ]
  }
}

function buildFsBreadcrumbs(entity, relativePathParts) {
  return relativePathParts.map((path) => ({
    text: path === '/' ? 'Files' : path,
    href: `/services/${entity.name}${relativePathParts.join('/')}`
  }))
}
