import qs from 'qs'

import { appConfig } from '~/src/config'
import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details'
import { saveToCdpUser } from '~/src/server/admin/users/helpers/save-to-cdp-user'
import { userDetailsValidation } from '~/src/server/admin/users/helpers/schema/user-details-validation'
import { sessionNames } from '~/src/server/common/constants/session-names'

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

      return h.redirect(
        appConfig.get('appPathPrefix') +
          `/admin/users/create/user-details${queryString}`
      )
    }

    if (!validationResult.error) {
      saveToCdpUser(request, {
        ...sanitisedPayload,
        ...(button === 'skip' && {
          name: null,
          defraAwsId: null,
          defraVpnId: null
        })
      })

      return h.redirect(
        appConfig.get('appPathPrefix') + '/admin/users/create/summary'
      )
    }
  }
}

export { userDetailsController }
