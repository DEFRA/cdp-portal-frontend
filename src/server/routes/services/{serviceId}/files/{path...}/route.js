import { commonServiceExtensions } from '#server/common/helpers/ext/extensions.js'
import { scopes } from '@defra/cdp-validation-kit'
import { folderTreeForPath, listPathContents } from '../BucketService.js'

const byteValueNumberFormatter = Intl.NumberFormat('en', {
  notation: 'compact',
  style: 'unit',
  unit: 'byte',
  unitDisplay: 'narrow'
})

export const ext = [...commonServiceExtensions]

export const options = {
  id: 'services/{serviceId}/files',
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
    listPathContents(request, path),
    folderTreeForPath(request, path)
  ])

  const relativePathParts = [...path.split('/').filter((seg) => seg !== '')]

  return {
    entity,
    path,
    relativePathParts,
    folderContents,
    folderTree,
    sizeFormat: byteValueNumberFormatter.format,
    encodePathSegments,
    pageTile: 'Files',
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

function encodePathSegments(path) {
  const parts = path.split('/')
  const encoded = parts.map((part) => encodeURI(part))
  return encoded.join('/')
}

export async function POST(request, h) {
  // TODO: Server-side only upload if no client-side JS enabled

  return h.redirect(request.url)
}
