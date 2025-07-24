import Joi from 'joi'
import qs from 'qs'

import { buildErrorDetails } from '../../common/helpers/build-error-details.js'
import { fetchDeployableImageNames } from '../../common/helpers/fetch/fetch-deployable-image-names.js'
import { sessionNames } from '../../common/constants/session-names.js'
import { getEnvironments } from '../../common/helpers/environments/get-environments.js'
import { fetchAvailableMigrations } from '../../services/helpers/fetch/fetch-available-migrations.js'
import { dbChangeValidation } from '../helpers/schema/db-change-validation.js'

const changeDetailsController = {
  options: {
    validate: {
      params: Joi.object({
        multiStepFormId: Joi.string().uuid().optional()
      })
    }
  },
  handler: async (request, h) => {
    const payload = request?.payload
    const redirectLocation = payload?.redirectLocation
    const multiStepFormId = request.app.multiStepFormId

    const deployableImageNames = await fetchDeployableImageNames({ request })
    const migrations = await fetchAvailableMigrations(payload?.serviceName)
    const authedUser = await request.getUserSession()
    const environments = getEnvironments(authedUser?.scope)

    const validationResult = dbChangeValidation(
      deployableImageNames,
      migrations.map((migration) => migration.version).filter(Boolean),
      environments,
      payload.button
    ).validate(payload, {
      abortEarly: false
    })

    if (validationResult?.error) {
      const errorDetails = buildErrorDetails(validationResult.error.details)

      request.yar.flash(sessionNames.validationFailure, {
        formValues: payload,
        formErrors: errorDetails
      })

      const serviceName = payload?.serviceName
      const queryString = qs.stringify(
        {
          ...(redirectLocation && { redirectLocation }),
          ...(serviceName && { serviceName })
        },
        { addQueryPrefix: true }
      )

      return h.redirect(
        `/apply-changelog/change-details/${multiStepFormId}${queryString}`
      )
    }

    if (!validationResult.error && payload.button === 'search') {
      request.yar.flash(sessionNames.validationFailure, {
        formValues: payload
      })

      const serviceName = payload?.serviceName
      const queryString = qs.stringify(
        {
          ...(redirectLocation && { redirectLocation }),
          ...(serviceName && { serviceName })
        },
        { addQueryPrefix: true }
      )

      return h.redirect(
        `/apply-changelog/change-details/${multiStepFormId}${queryString}`
      )
    }

    if (!validationResult.error) {
      await request.app.saveStepData(multiStepFormId, payload, h)

      const redirectTo = redirectLocation
        ? `/apply-changelog/${redirectLocation}/${multiStepFormId}`
        : `/apply-changelog/summary/${multiStepFormId}`

      return h.redirect(redirectTo)
    }
  }
}

export { changeDetailsController }
