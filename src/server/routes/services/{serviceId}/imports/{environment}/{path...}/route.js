import {
  commonServiceExtensions,
  provideNotFoundIfPrototypeExtension
} from '#server/common/helpers/ext/extensions.js'
import { scopes } from '@defra/cdp-validation-kit'
import {
  listPathContents,
  folderTreeForPath
} from '#server/common/services/bucket-service/BucketService.js'
import { provideSubNav } from '#server/helpers/provide-sub-navigation.js'
import { SERVICE } from '#server/common/patterns/entities/tabs/constants.js'

export const ext = [
  ...commonServiceExtensions,
  provideNotFoundIfPrototypeExtension,
  {
    type: 'onPostHandler',
    method: provideSubNav('imports', SERVICE, { withoutAll: true }),
    options: {
      sandbox: 'plugin'
    }
  }
]

export const options = {
  id: 'services/{serviceId}/imports/{environment}',
  auth: {
    mode: 'required',
    access: {
      scope: [/* scopes.serviceOwner, */ scopes.admin] // TODO: Open to owners
    }
  }
}

export default async function (request) {
  const { path = '', environment } = request.params
  const entity = request.app.entity

  const [folderContents, folderTree] = await Promise.all([
    listPathContents(request, `/entities/${entity.name}/imports/`, path),
    folderTreeForPath(request, `/entities/${entity.name}/imports/`, path)
  ])

  const relativePathParts = path.split('/').filter((seg) => seg !== '')

  const folderList = folderContents.map((resource) => {
    return {
      ...resource,
      actions: resource.isFolder
        ? [
            {
              text: 'Delete',
              href: `/services/${entity.name}/imports-action/${resource.path}?action=delete`
            }
          ]
        : [
            {
              text: 'Download',
              href: `/services/${entity.name}/imports-resource/${resource.path}`
            },
            {
              text: 'Delete',
              href: `/services/${entity.name}/imports-action/${resource.path}?action=delete`
            }
          ]
    }
  })

  return {
    entity,
    environment,
    path,
    relativePathParts,
    folderList,
    filenames: folderList.map(({ name }) => name),
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
        text: 'Imports',
        href:
          path !== ''
            ? `/services/${entity.name}/imports/${environment}`
            : undefined
      },
      ...relativePathParts.map((part, index) => {
        const partPath = relativePathParts.slice(0, index + 1).join('/')
        return {
          text: part,
          href:
            path !== partPath
              ? `/services/${entity.name}/imports/${environment}/${partPath}/`
              : undefined
        }
      })
    ]
  }
}

export async function POST(request, h) {
  const { files } = request.payload

  if (files) {
    // TODO: Handle Server-side only upload if no client-side JS enabled?
  }
  return h.redirect(request.url)
}
