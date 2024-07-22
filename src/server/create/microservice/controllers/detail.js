import qs from 'qs'

import { sessionNames } from '~/src/server/common/constants/session-names'
import { getUsersTeams } from '~/src/server/common/helpers/user/get-users-teams'
import { saveToCreate, setStepComplete } from '~/src/server/create/helpers/form'
import {
  buildErrorDetails,
  reduceErrorMessages
} from '~/src/server/common/helpers/build-error-details'
import { fetchServiceTypes } from '~/src/server/create/microservice/helpers/fetch/fetch-service-types'
import { microserviceValidation } from '~/src/server/create/microservice/helpers/schema/microservice-validation'

const microserviceDetailController = {
  handler: async (request, h) => {
    const payload = request?.payload
    const repositoryName = payload.repositoryName
    const serviceTypeTemplate = payload.serviceTypeTemplate
    const teamId = payload.teamId
    const redirectLocation = payload?.redirectLocation

    const { serviceTypes } = await fetchServiceTypes()
    const serviceTypeTemplates = serviceTypes.map(
      (serviceType) => serviceType.value
    )

    const validationResult = await microserviceValidation(serviceTypeTemplates)
      .validateAsync(payload, { abortEarly: false })
      .then((value) => ({ value }))
      .catch((error) => ({ value: payload, error }))

    const sanitisedPayload = {
      repositoryName,
      serviceTypeTemplate,
      teamId
    }

    if (validationResult?.error) {
      const errorDetails = buildErrorDetails(validationResult.error.details)

      request.yar.flash(sessionNames.validationFailure, {
        formValues: sanitisedPayload,
        formErrors: errorDetails
      })

      const errorMessages = reduceErrorMessages(validationResult)
      request.logger.warn({ errorMessages }, 'Validation failed')

      const queryString = redirectLocation
        ? qs.stringify({ redirectLocation }, { addQueryPrefix: true })
        : ''

      return h.redirect(`/create/microservice/detail${queryString}`)
    }

    if (!validationResult.error) {
      const usersTeams = await getUsersTeams(request)
      const team = usersTeams.find((team) => team.teamId === teamId)
      const serviceTypeDetail = serviceTypes.find(
        (serviceType) => serviceType.value === serviceTypeTemplate
      )

      await saveToCreate(request, h, {
        ...sanitisedPayload,
        ...(team && { teamName: team.name }),
        ...(serviceTypeDetail && { serviceTypeName: serviceTypeDetail.text })
      })
      await setStepComplete(request, h, 'stepTwo')

      return h.redirect('/create/microservice/summary')
    }
  }
}

export { microserviceDetailController }
