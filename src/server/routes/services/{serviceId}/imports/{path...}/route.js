import { commonServiceExtensions } from '#server/common/helpers/ext/extensions.js'
import { scopes } from '@defra/cdp-validation-kit'
import {
  listPathContents,
  folderTreeForPath
} from '#server/common/services/bucket-service/BucketService.js'

export const ext = [...commonServiceExtensions]

export const options = {
  id: 'services/{serviceId}/imports',
  auth: {
    mode: 'required',
    access: {
      scope: [/* scopes.serviceOwner, */ scopes.admin] // TODO: Open to owners
    }
  }
}

export default async function (request) {
  const { path = '' } = request.params
  const entity = request.app.entity

  const [folderContents, folderTree] = await Promise.all([
    listPathContents(request, entity.name, path),
    folderTreeForPath(request, entity.name, path)
  ])

  const relativePathParts = [...path.split('/').filter((seg) => seg !== '')]

  return {
    entity,
    path,
    relativePathParts,
    folderContents,
    folderTree,
    pageTitle: 'Imports',
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
        text: 'Imports'
      }
    ]
  }
}

export async function POST(request, h) {
  const { files } = request.payload

  if (files) {
    // TODO: Handle Server-side only upload if no client-side JS enabled
  }
  return h.redirect(request.url)
}
