import { config } from '#config/config.js'
import { fetchJson } from '#server/common/helpers/fetch/fetch-json.js'
import { scopes } from '@defra/cdp-validation-kit'
import { Boom } from '@hapi/boom'
import { parseISO, subMinutes } from 'date-fns'
import Joi from 'joi'
import { serializeBasket } from '../../domain/basket.js'
import { sessionNames } from '#server/common/constants/session-names.js'
import handleNoBasket from '../../ext/handleNoBasket.js'

export const ext = [handleNoBasket]

export const options = {
  auth: {
    mode: 'required',
    access: {
      scope: scopes.admin // TODO: Open to tenants
    }
  },
  validate: {
    params: Joi.object({
      workflowRunId: Joi.number()
    }),
    failAction: () => Boom.boomify(Boom.notFound())
  }
}

export default async function (request) {
  const workflowRunId = request.params.workflowRunId

  const { payload } = await fetchJson(
    `${config.get('portalBackendUrl')}/resources/requests/${workflowRunId}`
  )

  const { requestedAt, workflow, pullRequest } = payload
  const prUrl = pullRequest?.url

  const isTwentyMinutesOld = parseISO(requestedAt) < subMinutes(Date.now(), 20)

  return {
    workflow,
    prUrl,
    isTwentyMinutesOld
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
        'Failed to submit request: ' + error?.data?.payload?.message ?? error
      )
    }

    return h.redirect('/create/resources/summary')
  }
}
