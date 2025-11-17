import Joi from 'joi'
import qs from 'qs'

import { sessionNames } from '../../../common/constants/session-names.js'
import { buildErrorDetails } from '../../../common/helpers/build-error-details.js'
import { getEnvironments } from '../../../common/helpers/environments/get-environments.js'
import { serviceValidation } from '../../helpers/schema/service-validation.js'
import { fetchAvailableVersions } from '../../helpers/fetch/fetch-available-versions.js'
import { nullify404 } from '../../../common/helpers/nullify-404.js'
import {
  fetchServiceNames,
  fetchEntity
} from '../../../common/helpers/fetch/fetch-entities.js'
import { entitySubTypes } from '@defra/cdp-validation-kit'

const detailsController = {
  options: {
    validate: {
      params: Joi.object({
        multiStepFormId: Joi.string().uuid().optional()
      })
    }
  },
  handler: async (request, h) => {
    const payload = request?.payload
    const userSession = request.auth.credentials
    const redirectLocation = payload?.redirectLocation
    const multiStepFormId = request.app.multiStepFormId

    const serviceNames = await fetchServiceNames(userSession)
    const availableVersions = await fetchAvailableVersions(payload?.imageName)
    const environments = getEnvironments(userSession?.scope)

    const validationResult = serviceValidation(
      serviceNames,
      availableVersions.map((version) => version.tag),
      environments,
      payload.button
    ).validate(payload, {
      abortEarly: false
    })

    if (validationResult?.error) {
      const errorDetails = buildErrorDetails(validationResult.error.details)

      request.yar.flash(sessionNames.validationFailure, {
        formValues: payload,
        formErrors: errorDetails
      })

      const imageName = payload?.imageName
      const queryString = qs.stringify(
        {
          ...(redirectLocation && { redirectLocation }),
          ...(imageName && { imageName })
        },
        { addQueryPrefix: true }
      )

      return h.redirect(
        `/deploy-service/details/${multiStepFormId}${queryString}`
      )
    }

    if (!validationResult.error && payload.button === 'search') {
      request.yar.flash(sessionNames.validationFailure, {
        formValues: payload
      })

      const imageName = payload?.imageName
      const queryString = qs.stringify(
        {
          ...(redirectLocation && { redirectLocation }),
          ...(imageName && { imageName })
        },
        { addQueryPrefix: true }
      )

      return h.redirect(
        `/deploy-service/details/${multiStepFormId}${queryString}`
      )
    }

    if (!validationResult.error) {
      const entity = await fetchEntity(payload.imageName).catch(nullify404)
      await request.app.saveStepData(
        multiStepFormId,
        {
          ...payload,
          isPrototype: entity.subType === entitySubTypes.prototype
        },
        h
      )

      const redirectTo = redirectLocation
        ? `/deploy-service/${redirectLocation}/${multiStepFormId}`
        : `/deploy-service/options/${multiStepFormId}`

      return h.redirect(redirectTo)
    }
  }
}

export { detailsController }
