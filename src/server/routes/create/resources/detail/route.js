import { formatText } from '#config/nunjucks/filters/filters.js'
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
  if (!request.yar.get(sessionNames.resourcesBasket)) {
    request.yar.set(sessionNames.resourcesBasket, {
      s3_bucket: {}
    })

    await request.yar.commit(h)
  }

  const basket = request.yar.get(sessionNames.resourcesBasket)

  const userIsAdmin = await request.userIsAdmin()

  return {
    basket,
    resourcesToRows: resourcesToRows(userIsAdmin)
  }
}

function resourcesToRows(userIsAdmin) {
  return (type, resources) => {
    const entries = Object.entries(resources)

    if (entries.length) {
      return entries.map(([uuid, { name, ...props }]) => ({
        key: {
          text: name
        },
        value: {
          html: `<table class="table--embedded">${Object.entries(props)
            .filter(([field]) => field !== 'environments' || userIsAdmin)
            .map(
              ([field, value]) => `<tr>
            <th>${formatText(field)}</th>
            <td>${value}</td>
          </tr>`
            )
            .join('')}</table>`
        },
        actions: {
          items: [
            {
              href: `/create/resources/detail/${type}/${uuid}`,
              text: 'Edit'
            },
            {
              href: `/create/resources/detail/${type}/${uuid}/remove`,
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
}
