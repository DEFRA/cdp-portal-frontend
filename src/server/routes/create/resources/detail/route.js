import { sessionNames } from '#server/common/constants/session-names.js'
import { scopes } from '@defra/cdp-validation-kit'

export const options = {
  auth: {
    mode: 'required',
    access: {
      scope: scopes.admin // TODO: Open to tenants
    }
  }
}

export default async function (request, h) {
  const basket = request.yar.get(sessionNames.resourcesRequest) ?? {
    s3_bucket: {}
  }

  console.dir(basket, { depth: 10 })

  return {
    basket,
    resourcesToRows
  }
}

function resourcesToRows(type, resources) {
  const entries = Object.entries(resources)

  if (entries.length) {
    return entries.map(([name, props]) => ({
      key: {
        text: name
      },
      value: {
        html: '<table></table>'
      },
      actions: {
        items: [
          {
            href: `/create/resources/detail/${type}/${name}`,
            text: 'Edit'
          },
          {
            href: `/create/resources/detail/${type}/${name}/remove`,
            text: 'Remove'
          }
        ]
      }
    }))
  }

  return [
    {
      key: {
        html: `<a href="/create/resources/detail/${type}">Add</a>`
      }
    }
  ]
}
