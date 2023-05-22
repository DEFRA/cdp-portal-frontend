import fetch from 'node-fetch'
import { appConfig } from '~/src/config'
import { createServiceValidationSchema } from '~/src/app/create-service/helpers/create-service-validation-schema'
import { buildErrorDetails } from '~/src/app/common/helpers/build-error-details'
import { fetchTeams } from '~/src/app/teams/helpers/fetch-teams'
import { buildSelectOptions } from '~/src/common/helpers/build-select-options'

// TODO get this from the API layer
const serviceTypes = [
  'cdp-node-frontend-template',
  'cdp-node-backend-template',
  'cdp-dotnet-backend-template',
  'cdp-java-backend-template'
]

const createServiceController = {
  handler: async (request, h) => {
    const payload = request?.payload

    const { teams } = await fetchTeams()
    const teamsIds = teams.map((team) => team.id)

    const validationResult = createServiceValidationSchema(
      serviceTypes,
      teamsIds
    ).validate(payload, {
      abortEarly: false
    })

    if (validationResult?.error) {
      const errorDetails = buildErrorDetails(validationResult.error.details)

      const teamsOptions = buildSelectOptions(
        teams.map((team) => ({
          text: team.name,
          value: team.id
        }))
      )

      return h.view('create-service/views/form', {
        pageTitle: 'Error | Create a new micro-service',
        heading: 'Create a new micro-service',
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
