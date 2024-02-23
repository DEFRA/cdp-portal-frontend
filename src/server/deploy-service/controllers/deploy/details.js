import qs from 'qs'

import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details'
import { serviceValidation } from '~/src/server/deploy-service/helpers/schema/service-validation'
import { buildOptions } from '~/src/server/common/helpers/options/build-options'
import { optionsWithMessage } from '~/src/server/common/helpers/options/options-with-message'
import {
  saveToDeployment,
  setStepComplete
} from '~/src/server/deploy-service/helpers/form'
import { fetchDeployableImageNames } from '~/src/server/deploy-service/helpers/fetch/fetch-deployable-image-names'
import { fetchAvailableVersions } from '~/src/server/deploy-service/helpers/fetch/fetch-available-versions'
import { sessionNames } from '~/src/server/common/constants/session-names'
import { fetchEnvironments } from '~/src/server/common/helpers/fetch/fetch-environments'

const detailsController = {
  handler: async (request, h) => {
    const payload = request?.payload
    const redirectLocation = payload?.redirectLocation

    const deployableImageNames = await fetchDeployableImageNames(request)
    const availableVersions = await fetchAvailableVersions(payload?.imageName)
    const environments = await fetchEnvironments(request)

    const validationResult = serviceValidation(
      deployableImageNames,
      availableVersions,
      environments
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

      return h.redirect(`/deploy-service/details${queryString}`)
    }

    if (!validationResult.error) {
      await saveToDeployment(request, h, payload)
      await setStepComplete(request, h, 'stepOne')

      const redirectTo = redirectLocation
        ? `/deploy-service/${redirectLocation}`
        : '/deploy-service/options'

      return h.redirect(redirectTo)
    }
  }
}

export { detailsController }
