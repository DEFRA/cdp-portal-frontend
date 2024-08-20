import Joi from 'joi'
import qs from 'qs'

import { buildOptions } from '~/src/server/common/helpers/options/build-options'
import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details'
import { optionsWithMessage } from '~/src/server/common/helpers/options/options-with-message'
import { availableInstances } from '~/src/server/deploy-service/constants/available-instances'
import { optionsValidation } from '~/src/server/deploy-service/helpers/schema/options-validation'
import { fetchDeployServiceOptions } from '~/src/server/deploy-service/helpers/fetch/fetch-deploy-service-options'
import { sessionNames } from '~/src/server/common/constants/session-names'

const optionsController = {
  options: {
    validate: {
      params: Joi.object({
        multiStepFormId: Joi.string().uuid().required()
      })
    }
  },
  handler: async (request, h) => {
    const payload = request?.payload
    const cpu = payload?.cpu
    const redirectLocation = payload?.redirectLocation
    const multiStepFormId = request.app.multiStepFormId

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
        formValues: {
          ...payload,
          availableMemoryOptions: cpu
            ? buildOptions(ecsCpuToMemoryOptionsMap[cpu])
            : optionsWithMessage('Choose a CPU value')
        },
        formErrors: errorDetails
      })

      const queryString = payload?.redirectLocation
        ? qs.stringify({ redirectLocation }, { addQueryPrefix: true })
        : ''

      return h.redirect(
        `/deploy-service/options/${multiStepFormId}${queryString}`
      )
    }

    if (!validationResult.error) {
      await request.app.saveStepData(multiStepFormId, payload, h)

      return h.redirect(`/deploy-service/summary/${multiStepFormId}`)
    }
  }
}

export { optionsController }
