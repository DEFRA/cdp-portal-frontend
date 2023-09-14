import { appConfig } from '~/src/config'
import { createServiceValidation } from '~/src/server/create-service/helpers/schema/create-service-validation'
import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details'
import { fetchTeams } from '~/src/server/teams/helpers/fetch-teams'
import { buildOptions } from '~/src/server/common/helpers/build-options'
import { fetchServiceTypes } from '~/src/server/create-service/helpers/fetch-service-types'
import { sessionNames } from '~/src/server/common/constants/session-names'
import { fetchWithAuth } from '~/src/server/common/helpers/fetch-with-auth'

const createServiceController = {
  handler: async (request, h) => {
    const payload = request?.payload

    const { serviceTypes } = await fetchServiceTypes()
    const serviceTypesIds = serviceTypes.map((serviceType) => serviceType.value)

    const { teams } = await fetchTeams()
    const teamsIds = teams.map((team) => team.id)

    const validationResult = createServiceValidation(
      serviceTypesIds,
      teamsIds
    ).validate(payload, {
      abortEarly: false
    })

    if (validationResult?.error) {
      const errorDetails = buildErrorDetails(validationResult.error.details)

      const serviceTypesOptions = buildOptions(serviceTypes)

      const teamsOptions = buildOptions(
        teams.map((team) => ({
          text: team.name,
          value: team.id
        }))
      )

      return h.view('create-service/views/form', {
        pageTitle: 'Error | Create a new micro-service',
        heading: 'Create a new micro-service',
        serviceTypesOptions,
        teamsOptions,
        errors: errorDetails,
        values: payload
      })
    }

    if (!validationResult.error) {
      const selfServiceOpsV1CreateServiceEndpointUrl = `${appConfig.get(
        'selfServiceOpsApiUrl'
      )}/create-service`

      await fetchWithAuth(
        request.yar?.auth,
        selfServiceOpsV1CreateServiceEndpointUrl,
        {
          body: JSON.stringify(validationResult.value)
        }
      )

      request.yar.flash(sessionNames.notifications, {
        text: 'Service successfully created',
        type: 'success'
      })

      return h.redirect(appConfig.get('appPathPrefix') + '/create-service')
    }
  }
}

export { createServiceController }
