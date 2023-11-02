import { config } from '~/src/config'
import { createServiceValidation } from '~/src/server/create-service/helpers/schema/create-service-validation'
import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details'
import { fetchTeams } from '~/src/server/teams/helpers/fetch-teams'
import { fetchServiceTypes } from '~/src/server/create-service/helpers/fetch-service-types'
import { sessionNames } from '~/src/server/common/constants/session-names'
import { provideCreate } from '~/src/server/create-service/helpers/pre/provide-create'

const createServiceController = {
  options: {
    pre: [provideCreate]
  },
  handler: async (request, h) => {
    const payload = request?.payload
    const repositoryName = payload.repositoryName
    const serviceType = payload.serviceType
    const owningTeam = payload.owningTeam

    const { serviceTypes } = await fetchServiceTypes()
    const serviceTypesIds = serviceTypes.map((serviceType) => serviceType.value)

    const { teams } = await fetchTeams(true)
    const teamsGithubHandles = teams.map((team) => team.github)

    const validationResult = createServiceValidation(
      serviceTypesIds,
      teamsGithubHandles
    ).validate(payload, {
      abortEarly: false
    })

    const sanitisedPayload = {
      repositoryName,
      serviceType,
      owningTeam
    }

    if (validationResult?.error) {
      const errorDetails = buildErrorDetails(validationResult.error.details)

      request.yar.flash(sessionNames.validationFailure, {
        formValues: sanitisedPayload,
        formErrors: errorDetails
      })

      return h.redirect(config.get('appPathPrefix') + '/create-service')
    }

    if (!validationResult.error) {
      const selfServiceOpsCreateServiceEndpointUrl =
        config.get('selfServiceOpsApiUrl') + '/create-service'

      const response = await request.fetchWithAuth(
        selfServiceOpsCreateServiceEndpointUrl,
        {
          method: 'post',
          body: JSON.stringify(sanitisedPayload)
        }
      )
      const json = await response.json()

      if (response.ok) {
        request.yar.clear(sessionNames.validationFailure)
        await request.yar.commit(h)

        request.yar.flash(sessionNames.notifications, {
          text: json.message,
          type: 'success'
        })

        return h.redirect(
          config.get('appPathPrefix') + `/services/${json.repositoryName}`
        )
      }

      request.yar.flash(sessionNames.validationFailure, {
        formValues: sanitisedPayload
      })
      request.yar.flash(sessionNames.globalValidationFailures, json.message)

      return h.redirect(config.get('appPathPrefix') + '/create-service')
    }
  }
}

export { createServiceController }
