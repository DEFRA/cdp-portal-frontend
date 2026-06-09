import qs from 'qs'

import { sessionNames } from '../../common/constants/session-names.js'
import { buildErrorDetails } from '../../common/helpers/build-error-details.js'
import { chooseValidation } from '../helpers/schema/choose-validation.js'

const chooseKindController = {
  handler: async (request, h) => {
    const payload = request?.payload
    const kind = payload.kind
    const redirectLocation = payload?.redirectLocation
    const userIsAdmin = await request.userIsAdmin()

    const validationResult = chooseValidation(userIsAdmin).validate(payload, {
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
      await request.yar.set(sessionNames.create, {}) // Flow changes based on first step
      await request.yar.set(sessionNames.resourcesBasket, undefined) // Flow changes based on first step
      await request.app.saveStepData(sanitisedPayload, h)

      const redirectTo =
        redirectLocation && sanitisedPayload?.repositoryName
          ? `/create/${kind}/${redirectLocation}`
          : `/create/${kind}/detail`

      return h.redirect(redirectTo)
    }
  }
}

export { chooseKindController }
