import { config } from '#config/config.js'
import { fetchJson } from '#server/common/helpers/fetch/fetch-json.js'
import { scopes } from '@defra/cdp-validation-kit'
import { Boom } from '@hapi/boom'
import { parseISO, subMinutes } from 'date-fns'
import Joi from 'joi'
import { serializeBasket } from '../domain/basket.js'
import { sessionNames } from '#server/common/constants/session-names.js'
import handleNoBasket from '../ext/handleNoBasket.js'

export const ext = [handleNoBasket]

export const options = {
  auth: {
    mode: 'required',
    access: {
      scope: scopes.admin // TODO: Open to tenants
    }
  }
}

export default async function (request, h) {
  const basket = request.yar.get(sessionNames.resourcesBasket)

  if (!basket) {
    return h.redirect('/create/resources/detail')
  }

  return {
    basket
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
    await request.authedFetchJson(
      `${config.get('portalBackendUrl')}/resources/requests`,
      {
        method: 'post',
        payload: resourceRequest
      }
    )

    return h.redirect(`/requests`)
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
        'Failed to submit request: ' +
          (error?.data?.payload?.message ??
            error?.output?.payload?.message ??
            error)
      )
    }

    return h.redirect('/create/resources/detail')
  }
}
