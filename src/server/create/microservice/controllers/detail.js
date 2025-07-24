import qs from 'qs'

import { sessionNames } from '../../../common/constants/session-names.js'
import { getUsersTeams } from '../../../common/helpers/user/get-users-teams.js'
import { saveToCreate, setStepComplete } from '../../helpers/form/index.js'
import { buildErrorDetails } from '../../../common/helpers/build-error-details.js'
import { fetchServiceTemplates } from '../helpers/fetch/fetch-service-templates.js'
import { microserviceValidation } from '../helpers/schema/microservice-validation.js'

const microserviceDetailController = {
  handler: async (request, h) => {
    const payload = request?.payload
    const microserviceName = payload.microserviceName
    const serviceTypeTemplateId = payload.serviceTypeTemplateId
    const teamId = payload.teamId
    const redirectLocation = payload?.redirectLocation

    const { serviceTemplates } = await fetchServiceTemplates(request)
    const templateIds = serviceTemplates.map((template) => template.id)

    const validationResult = await microserviceValidation(templateIds)
      .validateAsync(payload, { abortEarly: false })
      .then((value) => ({ value }))
      .catch((error) => ({ value: payload, error }))

    const sanitisedPayload = {
      microserviceName,
      serviceTypeTemplateId,
      teamId,
      templateTag: payload.templateTag ?? ''
    }

    if (validationResult?.error) {
      const errorDetails = buildErrorDetails(validationResult.error.details)

      request.yar.flash(sessionNames.validationFailure, {
        formValues: sanitisedPayload,
        formErrors: errorDetails
      })

      const queryString = redirectLocation
        ? qs.stringify({ redirectLocation }, { addQueryPrefix: true })
        : ''

      return h.redirect(`/create/microservice/detail${queryString}`)
    }

    if (!validationResult.error) {
      const usersTeams = await getUsersTeams(request)
      const team = usersTeams.find((team) => team.teamId === teamId)
      const serviceTemplateDetail = serviceTemplates.find(
        (serviceTemplate) => serviceTemplate.id === serviceTypeTemplateId
      )

      await saveToCreate(request, h, {
        ...sanitisedPayload,
        ...(team && { teamName: team.name }),
        ...(serviceTemplateDetail && {
          serviceTypeName: serviceTemplateDetail.templateName
        })
      })
      await setStepComplete(request, h, 'stepTwo')

      return h.redirect('/create/microservice/summary')
    }
  }
}

export { microserviceDetailController }
