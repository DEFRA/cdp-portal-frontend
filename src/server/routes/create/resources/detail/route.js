import { formatText } from '#config/nunjucks/filters/filters.js'
import { sessionNames } from '#server/common/constants/session-names.js'
import { scopes } from '@defra/cdp-validation-kit'
import { formatResource, initBasket } from './domain/basket.js'

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
    request.yar.set(sessionNames.resourcesBasket, initBasket())

    await request.yar.commit(h)
  }

  const basket = request.yar.get(sessionNames.resourcesBasket)

  const userIsAdmin = await request.userIsAdmin()

  return {
    basket,
    resourcesToRows: resourcesToRows(userIsAdmin)
  }
}

export async function POST(request, h) {
  const basket = request.yar.get(sessionNames.resourcesBasket)

  if (!basket) {
    return h.redirect('/create/resources/detail')
  }

  const resourceRequest = Object.fromEntries(
    Object.entries(basket).map(([type, resources]) => [
      type,
      Object.entries(resources).map(([_, props]) => props)
    ])
  )

  // TODO: call the BE with the resourceRequest
  request.logger.info(resourceRequest, 'Request resources:')

  return h.redirect('/create/resources/detail')
}

function resourcesToRows(userIsAdmin) {
  return (type, resources) => {
    const entries = Object.entries(resources)

    if (entries.length) {
      return entries
        .map(([uuid, res]) => [uuid, formatResource(res, userIsAdmin)])
        .map(([uuid, { name, ...props }]) => ({
          key: {
            text: name
          },
          value: {
            html: renderObject(props, userIsAdmin)
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
          text: '- - -'
        }
      }
    ]
  }
}

function renderObject(obj) {
  return `<table class="table--embedded">${Object.entries(obj)
    .map(
      ([field, value]) => `<tr>
    <th>${formatText(field).replaceAll('-', ' ')}</th>
    <td>${typeof value === 'object' ? renderObject(value) : value}</td>
  </tr>`
    )
    .join('')}</table>`
}
