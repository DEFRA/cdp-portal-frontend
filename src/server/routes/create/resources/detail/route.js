import { formatText } from '#config/nunjucks/filters/filters.js'
import { sessionNames } from '#server/common/constants/session-names.js'
import { scopes } from '@defra/cdp-validation-kit'
import { provideFormContextValues } from '#server/common/helpers/form/provide-form-context-values.js'
import {
  formatBasketResource,
  initBasket,
  serializeBasket
} from './domain/basket.js'
import { config } from '#config/config.js'

export const options = {
  auth: {
    mode: 'required',
    access: {
      scope: scopes.admin // TODO: Open to tenants
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

  const resourceRequest = serializeBasket(basket)

  request.logger.info(`Requested resources: ${JSON.stringify(resourceRequest)}`)

  try {
    const { payload } = await request.authedFetchJson(
      `${config.get('portalBackendUrl')}/resources`,
      {
        method: 'post',
        payload: resourceRequest
      }
    )

    request.yar.set(sessionNames.resourcesRequest, {
      basket,
      workflow: payload
    })
    await request.yar.commit(h)

    return h.redirect('/create/resources/summary')
  } catch (error) {
    request.logger.error(error, 'Resources request failed:')

    if (error?.data?.res.statusCode === 400 && error.data.payload?.errors) {
      request.yar.flash(sessionNames.validationFailure, {
        formMessages: error.data.payload.errors.map((msg) => ({
          text: msg
        }))
      })
    } else {
      request.yar.flash(
        sessionNames.globalValidationFailures,
        'Failed to submit request: ' + error?.data?.payload?.message ?? error
      )
    }

    return h.redirect('/create/resources/detail')
  }
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
