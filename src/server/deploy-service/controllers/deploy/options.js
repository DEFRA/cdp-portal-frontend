import Joi from 'joi'
import qs from 'qs'

import { buildOptions } from '../../../common/helpers/options/build-options.js'
import { buildErrorDetails } from '../../../common/helpers/build-error-details.js'
import { optionsWithMessage } from '../../../common/helpers/options/options-with-message.js'
import { availableInstances } from '../../constants/available-instances.js'
import { optionsValidation } from '../../helpers/schema/options-validation.js'
import { fetchDeployServiceOptions } from '../../../common/helpers/fetch/fetch-deploy-service-options.js'
import { sessionNames } from '../../../common/constants/session-names.js'

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
