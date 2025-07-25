import Joi from 'joi'
import qs from 'qs'

import { sessionNames } from '../../../common/constants/session-names.js'
import { buildErrorDetails } from '../../../common/helpers/build-error-details.js'
import { getEnvironments } from '../../../common/helpers/environments/get-environments.js'
import { serviceValidation } from '../../helpers/schema/service-validation.js'
import { fetchDeployableImageNames } from '../../../common/helpers/fetch/fetch-deployable-image-names.js'
import { fetchAvailableVersions } from '../../helpers/fetch/fetch-available-versions.js'

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
    const environments = getEnvironments(authedUser?.scope)

    const validationResult = serviceValidation(
      deployableImageNames,
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
      await request.app.saveStepData(multiStepFormId, payload, h)

      const redirectTo = redirectLocation
        ? `/deploy-service/${redirectLocation}/${multiStepFormId}`
        : `/deploy-service/options/${multiStepFormId}`

      return h.redirect(redirectTo)
    }
  }
}

export { detailsController }
