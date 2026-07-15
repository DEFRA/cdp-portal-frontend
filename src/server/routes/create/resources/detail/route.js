import { formatText } from '#config/nunjucks/filters/filters.js'
import { sessionNames } from '#server/common/constants/session-names.js'
import { scopes } from '@defra/cdp-validation-kit'
import { provideFormContextValues } from '#server/common/helpers/form/provide-form-context-values.js'
import {
  formatBasketResource,
  initBasket,
  numberOfItemsInBasket
} from '../domain/basket.js'

export const options = {
  auth: {
    mode: 'required',
    access: {
      scope: [scopes.admin, scopes.tenant]
    }
  }
}

export const ext = [
  {
    type: 'onPostHandler',
    method: provideFormContextValues(),
    options: { before: ['yar'], sandbox: 'plugin' }
  }
]

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

  if (numberOfItemsInBasket(basket) === 0) {
    request.yar.flash(sessionNames.validationFailure, {
      formMessages: [
        { text: 'Please add at least one resource to the request' }
      ]
    })

    return h.redirect('/create/resources/detail')
  }

  return h.redirect('/create/resources/summary')
}

function resourcesToRows(userIsAdmin) {
  return (type, resources) => {
    const entries = Object.entries(resources)

    if (entries.length) {
      return entries
        .map(([uuid, res]) => [uuid, formatBasketResource(res, userIsAdmin)])
        .map(([uuid, { name, ...props }]) => ({
          key: {
            text: name
          },
          value: {
            html: renderObject(props)
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
