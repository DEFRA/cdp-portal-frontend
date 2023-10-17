import qs from 'qs'

import { config, environments } from '~/src/config'
import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details'
import { serviceValidation } from '~/src/server/deploy-service/helpers/schema/service-validation'
import { buildOptions } from '~/src/server/common/helpers/build-options'
import { optionsWithMessage } from '~/src/server/common/helpers/options-with-message'
import {
  saveToDeployment,
  setStepComplete
} from '~/src/server/deploy-service/helpers/form'
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
          : optionsWithMessage('choose an image name')
      })

      const queryString = payload?.redirectLocation
        ? qs.stringify({ redirectLocation }, { addQueryPrefix: true })
        : ''

      return h.redirect(
        config.get('appPathPrefix') + `/deploy-service/details${queryString}`
      )
    }

    if (!validationResult.error) {
      await saveToDeployment(request, h, payload)
      await setStepComplete(request, h, 'stepOne')

      const redirectTo = redirectLocation
        ? `/deploy-service/${redirectLocation}`
        : '/deploy-service/options'

      return h.redirect(config.get('appPathPrefix') + redirectTo)
    }
  }
}

export { detailsController }
