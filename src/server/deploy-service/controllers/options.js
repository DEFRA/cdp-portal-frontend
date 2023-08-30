import qs from 'qs'

import { appConfig } from '~/src/config'
import { buildOptions } from '~/src/common/helpers/build-options'
import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details'
import { optionsWithMessage } from '~/src/server/common/helpers/options-with-message'
import { availableInstances } from '~/src/server/deploy-service/helpers/available-instances'
import { optionsValidation } from '~/src/server/deploy-service/helpers/schema/options-validation'
import { saveToDeploymentSession } from '~/src/server/deploy-service/helpers/save-to-deployment-session'
import { fetchDeployServiceOptions } from '~/src/server/deploy-service/helpers/fetch-deploy-service-options'
import { sessionNames } from '~/src/server/common/constants/session-names'

const optionsController = {
  handler: async (request, h) => {
    const payload = request?.payload
    const cpu = payload?.cpu
    const redirectLocation = payload?.redirectLocation

    const { cpuOptions, ecsCpuToMemoryOptionsMap } =
      await fetchDeployServiceOptions()

    const availableCpu = cpuOptions.map(({ value }) => value)
    const availableMemory =
      ecsCpuToMemoryOptionsMap[cpu]?.map(({ value }) => value) ?? []

    const validationResult = optionsValidation(
      availableInstances,
      availableCpu,
      availableMemory
    ).validate(payload, { abortEarly: false })

    if (validationResult?.error) {
      const errorDetails = buildErrorDetails(validationResult.error.details)

      request.yar.flash(sessionNames.validationFailure, {
        formValues: payload,
        formErrors: errorDetails,
        availableMemoryOptions: cpu
          ? buildOptions(ecsCpuToMemoryOptionsMap[cpu])
          : optionsWithMessage('Choose a CPU value')
      })

      const queryString = payload?.redirectLocation
        ? qs.stringify({ redirectLocation }, { addQueryPrefix: true })
        : ''

      return h.redirect(
        appConfig.get('appPathPrefix') + `/deploy-service/options${queryString}`
      )
    }

    if (!validationResult.error) {
      saveToDeploymentSession(request, payload)

      return h.redirect(
        `${appConfig.get('appPathPrefix')}/deploy-service/summary`
      )
    }
  }
}

export { optionsController }
