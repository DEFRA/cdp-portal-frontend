import Joi from 'joi'
import qs from 'qs'

import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details'
import { serviceValidation } from '~/src/server/deploy-service/helpers/schema/service-validation'
import { fetchDeployableImageNames } from '~/src/server/deploy-service/helpers/fetch/fetch-deployable-image-names'
import { fetchAvailableVersions } from '~/src/server/deploy-service/helpers/fetch/fetch-available-versions'
import { sessionNames } from '~/src/server/common/constants/session-names'
import { getEnvironments } from '~/src/server/common/helpers/environments/get-environments'

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
    const redirectLocation = payload?.redirectLocation
    const multiStepFormId = request.app.multiStepFormId

    const deployableImageNames = await fetchDeployableImageNames({ request })
    const availableVersions = await fetchAvailableVersions(payload?.imageName)
    const authedUser = await request.getUserSession()
    const environments = Object.values(getEnvironments(authedUser?.isAdmin))

    const validationResult = serviceValidation(
      deployableImageNames,
      availableVersions.map((version) => version.tag),
      environments,
      payload.button
    ).validate(payload, {
      abortEarly: false
    })

    // We have a validation error
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

    // No validation error
    if (!validationResult.error) {
      await request.app.saveStepData(multiStepFormId, payload, h)

      const redirectTo = redirectLocation
        ? `/deploy-service/${redirectLocation}/${multiStepFormId}`
        : `/deploy-service/options/${multiStepFormId}`

      return h.redirect(redirectTo)
    }
  }
}

export { detailsController }
