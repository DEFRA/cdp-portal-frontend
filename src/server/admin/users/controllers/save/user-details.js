import qs from 'qs'

import { buildErrorDetails } from '../../../../common/helpers/build-error-details.js'
import { saveToCdpUser, setStepComplete } from '../../helpers/form/index.js'
import { userDetailsValidation } from '../../helpers/schema/user-details-validation.js'
import { sessionNames } from '../../../../common/constants/session-names.js'

const userDetailsController = {
  handler: async (request, h) => {
    const payload = request?.payload
    const button = payload?.button
    const redirectLocation = payload?.redirectLocation

    const name = payload?.name || null
    const defraAwsId = payload?.defraAwsId || null
    const defraVpnId = payload?.defraVpnId || null

    const sanitisedPayload = {
      name,
      defraAwsId,
      defraVpnId
    }

    const validationResult = userDetailsValidation(button).validate(
      sanitisedPayload,
      {
        abortEarly: false
      }
    )

    if (validationResult?.error) {
      const errorDetails = buildErrorDetails(validationResult.error.details)

      request.yar.flash(sessionNames.validationFailure, {
        formValues: sanitisedPayload,
        formErrors: errorDetails
      })

      const queryString = qs.stringify(
        {
          ...(redirectLocation && { redirectLocation })
        },
        {
          addQueryPrefix: true
        }
      )

      return h.redirect(`/admin/users/user-details${queryString}`)
    }

    if (!validationResult.error) {
      await saveToCdpUser(request, h, {
        ...sanitisedPayload,
        ...(button === 'skip' && {
          defraAwsId: null,
          defraVpnId: null
        })
      })

      await setStepComplete(request, h, 'stepThree')

      return h.redirect('/admin/users/summary')
    }
  }
}

export { userDetailsController }
