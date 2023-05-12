import fetch from 'node-fetch'
import { appConfig } from '~/src/config'
import { createServiceValidationSchema } from '~/src/app/create-service/helpers/create-service-validation-schema'

// TODO get this from the API layer
const serviceTypes = [
  'cdp-node-frontend-template',
  'cdp-node-backend-template',
  'cdp-dotnet-backend-template',
  'cdp-java-backend-template'
]

// TODO get this from the API layer
const owningTeams = [
  'animal-and-plant-health',
  'cdp-platform',
  'fisheries',
  'forestry-management'
]

const createServiceController = {
  handler: async (request, h) => {
    const payload = request?.payload
    const validationResult = createServiceValidationSchema(
      serviceTypes,
      owningTeams
    ).validate(payload, {
      abortEarly: false
    })

    if (validationResult?.error) {
      const errorDetails = validationResult.error.details.reduce(
        (errors, detail) => {
          return {
            [detail.context.key]: {
              message: detail.message
            },
            ...errors
          }
        },
        {}
      )

      return h.view('create-service/views/form', {
        pageTitle: 'Error | Create a new Service',
        heading: 'Create a new Service',
        errors: errorDetails,
        values: payload
      })
    }

    if (!validationResult.error) {
      const teamsAndRepositoriesV1CreateServiceEndpointUrl = `${appConfig.get(
        'teamsAndRepositoriesV1ApiUrl'
      )}/create-service`

      await fetch(teamsAndRepositoriesV1CreateServiceEndpointUrl, {
        method: 'post',
        body: JSON.stringify({
          ...validationResult.value,
          repositoryName: validationResult.value.repositoryName
        }),
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
