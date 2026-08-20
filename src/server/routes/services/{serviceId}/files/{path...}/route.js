import { commonServiceExtensions } from '#server/common/helpers/ext/extensions.js'
import { scopes } from '@defra/cdp-validation-kit'
import { listPathContents } from '../BucketService.js'

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

export default async function (request, h) {
  const path = `/${request.params.path ?? ''}`
  const entity = request.app.entity

  const folderContents = await listPathContents(request, path)
  const relativePathParts = [...path.split('/').filter((seg) => seg !== '')]

  return {
    entity,
    path,
    relativePathParts,
    folderContents,
    sizeFormat: byteValueNumberFormatter.format,
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
        text: 'Files',
        href: path === '/' ? undefined : `/services/${entity.name}/files`
      },
      ...buildFsBreadcrumbs(entity, path, relativePathParts)
    ]
  }
}

function buildFsBreadcrumbs(entity, path, relativePathParts) {
  return relativePathParts.map((part, index) => {
    const partPath = '/' + relativePathParts.slice(0, index + 1).join('/')
    return {
      text: part,
      href:
        partPath === path
          ? undefined
          : `/services/${entity.name}/files${partPath}`
    }
  })
}
