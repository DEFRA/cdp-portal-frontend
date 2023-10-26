import { omit } from 'lodash'

import { config } from '~/src/config'
import { createServiceValidation } from '~/src/server/create-service/helpers/schema/create-service-validation'
import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details'
import { fetchTeams } from '~/src/server/teams/helpers/fetch-teams'
import { buildOptions } from '~/src/server/common/helpers/build-options'
import { fetchServiceTypes } from '~/src/server/create-service/helpers/fetch-service-types'
import { sessionNames } from '~/src/server/common/constants/session-names'

const createServiceController = {
  handler: async (request, h) => {
    const payload = request?.payload

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

    if (validationResult?.error) {
      const errorDetails = buildErrorDetails(validationResult.error.details)

      const serviceTypesOptions = buildOptions(serviceTypes)

      const teamsOptions = buildOptions(
        teams.map((team) => ({
          text: `${team.name} - @${team.github}`,
          value: team.github
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
      const isCreateV2 = payload.create === 'createV2'

      // TODO remove once new create flow is finished
      const selfServiceOpsCreateServiceEndpointUrl =
        config.get('selfServiceOpsApiUrl') +
        `/create-service${isCreateV2 ? '-v2' : ''}`

      // TODO handle failures
      await request.fetchWithAuth(selfServiceOpsCreateServiceEndpointUrl, {
        method: 'post',
        body: JSON.stringify(omit(validationResult.value, 'create')) // TODO remove omit when create flow finished
      })

      request.yar.flash(sessionNames.notifications, {
        text: 'Service successfully created',
        type: 'success'
      })

      return h.redirect(config.get('appPathPrefix') + '/create-service')
    }
  }
}

export { createServiceController }
