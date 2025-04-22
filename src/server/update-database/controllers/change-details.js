import Joi from 'joi'
import qs from 'qs'

import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details.js'
import { fetchDeployableImageNames } from '~/src/server/common/helpers/fetch/fetch-deployable-image-names.js'
import { sessionNames } from '~/src/server/common/constants/session-names.js'
import { getEnvironments } from '~/src/server/common/helpers/environments/get-environments.js'
import { fetchMigrations } from '~/src/server/services/helpers/fetch/fetch-migrations.js'
import { dbChangeValidation } from '~/src/server/update-database/helpers/schema/db-change-validation.js'

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
    const migrations = await fetchMigrations(payload?.imageName)
    const authedUser = await request.getUserSession()
    const environments = getEnvironments(authedUser?.scope)

    const validationResult = dbChangeValidation(
      deployableImageNames,
      migrations.map((migration) => migration.version),
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

      const imageName = payload?.imageName
      const queryString = qs.stringify(
        {
          ...(redirectLocation && { redirectLocation }),
          ...(imageName && { imageName })
        },
        { addQueryPrefix: true }
      )

      return h.redirect(
        `/update-database/change-details/${multiStepFormId}${queryString}`
      )
    }

    if (!validationResult.error && payload.button === 'search') {
      request.yar.flash(sessionNames.validationFailure, {
        formValues: payload
      })

      const imageName = payload?.imageName
      const queryString = qs.stringify(
        {
          ...(redirectLocation && { redirectLocation }),
          ...(imageName && { imageName })
        },
        { addQueryPrefix: true }
      )

      return h.redirect(
        `/update-database/change-details/${multiStepFormId}${queryString}`
      )
    }

    if (!validationResult.error) {
      await request.app.saveStepData(multiStepFormId, payload, h)

      const redirectTo = redirectLocation
        ? `/update-database/${redirectLocation}/${multiStepFormId}`
        : `/update-database/summary/${multiStepFormId}`

      return h.redirect(redirectTo)
    }
  }
}

export { changeDetailsController }
