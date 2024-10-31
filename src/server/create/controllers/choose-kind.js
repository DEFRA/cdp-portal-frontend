import qs from 'qs'

import { sessionNames } from '~/src/server/common/constants/session-names.js'
import { provideCreate } from '~/src/server/create/helpers/pre/provide-create.js'
import {
  saveToCreate,
  setStepComplete
} from '~/src/server/create/helpers/form/index.js'
import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details.js'
import { chooseValidation } from '~/src/server/create/helpers/schema/choose-validation.js'

const chooseKindController = {
  options: {
    pre: [provideCreate]
  },
  handler: async (request, h) => {
    const create = request.pre?.create

    const payload = request?.payload
    const kind = payload.kind
    const redirectLocation = payload?.redirectLocation

    const validationResult = chooseValidation.validate(payload, {
      abortEarly: false
    })

    const sanitisedPayload = { kind }

    if (validationResult?.error) {
      const errorDetails = buildErrorDetails(validationResult.error.details)

      request.yar.flash(sessionNames.validationFailure, {
        formValues: sanitisedPayload,
        formErrors: errorDetails
      })

      const queryString = redirectLocation
        ? qs.stringify({ redirectLocation }, { addQueryPrefix: true })
        : ''

      return h.redirect(`/create/choose-kind${queryString}`)
    }

    if (!validationResult.error) {
      const updatedCreate = await saveToCreate(
        request,
        h,
        sanitisedPayload,
        kind !== create?.kind
      )
      await setStepComplete(request, h, 'stepOne')

      const redirectTo =
        redirectLocation && updatedCreate?.repositoryName
          ? `/create/${kind}/${redirectLocation}`
          : `/create/${kind}/detail`

      return h.redirect(redirectTo)
    }
  }
}

export { chooseKindController }
