import fetch from 'node-fetch'
import { appConfig } from '~/src/config'
import { createServiceValidationSchema } from '~/src/server/create-service/helpers/create-service-validation-schema'
import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details'
import { fetchTeams } from '~/src/server/teams/helpers/fetch-teams'
import { buildSelectOptions } from '~/src/common/helpers/build-select-options'
import { fetchServiceTypes } from '~/src/server/create-service/helpers/fetch-service-types'

const createServiceController = {
  handler: async (request, h) => {
    const payload = request?.payload

    const { serviceTypes } = await fetchServiceTypes()
    const serviceTypesIds = serviceTypes.map((serviceType) => serviceType.value)

    const { teams } = await fetchTeams()
    const teamsIds = teams.map((team) => team.id)

    const validationResult = createServiceValidationSchema(
      serviceTypesIds,
      teamsIds
    ).validate(payload, {
      abortEarly: false
    })

    if (validationResult?.error) {
      const errorDetails = buildErrorDetails(validationResult.error.details)

      const serviceTypesOptions = buildSelectOptions(serviceTypes)

      const teamsOptions = buildSelectOptions(
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
        'selfServiceOpsV1ApiUrl'
      )}/create-service`

      await fetch(selfServiceOpsV1CreateServiceEndpointUrl, {
        method: 'post',
        body: JSON.stringify(validationResult.value),
        headers: { 'Content-Type': 'application/json' }
      })

      request.yar.flash('notifications', {
        text: 'Service successfully created',
        type: 'success'
      })

      return h.redirect(`${appConfig.get('appPathPrefix')}/create-service`)
    }
  }
}

export { createServiceController }
