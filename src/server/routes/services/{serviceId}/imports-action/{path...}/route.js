import { commonServiceExtensions } from '#server/common/helpers/ext/extensions.js'
import { scopes } from '@defra/cdp-validation-kit'

export const ext = [...commonServiceExtensions]

export const options = {
  id: 'services/{serviceId}/imports-action',
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
  const { action } = request.query

  const relativePathParts = [...path.split('/').filter((seg) => seg !== '')]

  return {
    pageTitle: 'Imports Action',
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
        href: path !== '' ? `/services/${entity.name}/imports` : undefined
      },
      ...relativePathParts.map((part, index) => {
        const partPath = relativePathParts.slice(0, index + 1).join('/')
        return {
          text: part,
          href:
            path !== partPath
              ? `/services/${entity.name}/imports/${partPath}/`
              : undefined
        }
      })
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
