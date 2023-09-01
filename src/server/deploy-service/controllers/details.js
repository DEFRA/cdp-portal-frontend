import qs from 'qs'

import { appConfig, environments } from '~/src/config'
import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details'
import { serviceValidation } from '~/src/server/deploy-service/helpers/schema/service-validation'
import { buildOptions } from '~/src/server/common/helpers/build-options'
import { optionsWithMessage } from '~/src/server/common/helpers/options-with-message'
import { saveToDeploymentSession } from '~/src/server/deploy-service/helpers/save-to-deployment-session'
import { fetchDeployableImageNames } from '~/src/server/deploy-service/helpers/fetch-deployable-image-names'
import { fetchAvailableVersions } from '~/src/server/deploy-service/helpers/fetch-available-versions'
import { sessionNames } from '~/src/server/common/constants/session-names'

const detailsController = {
  handler: async (request, h) => {
    const payload = request?.payload
    const redirectLocation = payload?.redirectLocation

    const deployableImageNames = await fetchDeployableImageNames()
    const availableVersions = await fetchAvailableVersions(payload?.imageName)

    const validationResult = serviceValidation(
      deployableImageNames,
      availableVersions,
      Object.values(environments)
    ).validate(payload, {
      abortEarly: false
    })

    if (validationResult?.error) {
      const errorDetails = buildErrorDetails(validationResult.error.details)

      request.yar.flash(sessionNames.validationFailure, {
        formValues: payload,
        formErrors: errorDetails,
        availableVersionOptions: availableVersions?.length
          ? buildOptions(availableVersions)
          : optionsWithMessage('Choose an image name')
      })

      const queryString = payload?.redirectLocation
        ? qs.stringify({ redirectLocation }, { addQueryPrefix: true })
        : ''

      return h.redirect(
        appConfig.get('appPathPrefix') + `/deploy-service/details${queryString}`
      )
    }

    if (!validationResult.error) {
      saveToDeploymentSession(request, payload)

      const redirectTo = redirectLocation
        ? `/deploy-service/${redirectLocation}`
        : '/deploy-service/options'

      return h.redirect(appConfig.get('appPathPrefix') + redirectTo)
    }
  }
}

export { detailsController }
