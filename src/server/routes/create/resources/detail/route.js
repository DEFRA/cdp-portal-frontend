import { formatText } from '#config/nunjucks/filters/filters.js'
import { sessionNames } from '#server/common/constants/session-names.js'
import { scopes } from '@defra/cdp-validation-kit'
import { initBasket } from './domain/basket.js'

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
  request.logger.info(`Request resources: ${JSON.stringify(resourceRequest)}`)

  return h.redirect('/create/resources/detail')
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
          text: '- - -'
        }
      }
    ]
  }
}
