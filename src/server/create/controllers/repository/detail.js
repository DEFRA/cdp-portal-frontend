import qs from 'qs'

import { sessionNames } from '~/src/server/common/constants/session-names'
import { getUsersTeams } from '~/src/server/common/helpers/user/get-users-teams'
import { saveToCreate, setStepComplete } from '~/src/server/create/helpers/form'
import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details'
import { repositoryValidation } from '~/src/server/create/helpers/schema/repository-validation'

const repositoryDetailController = {
  handler: async (request, h) => {
    const payload = request?.payload
    const repositoryName = payload.repositoryName
    const repositoryVisibility = payload.repositoryVisibility
    const teamId = payload.teamId
    const redirectLocation = payload?.redirectLocation

    const validationResult = await repositoryValidation()
      .validateAsync(payload, { abortEarly: false })
      .then((value) => ({ value }))
      .catch((error) => ({ value: payload, error }))

    const sanitisedPayload = {
      repositoryName,
      repositoryVisibility,
      teamId
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

      return h.redirect(`/create/repository-detail${queryString}`)
    }

    if (!validationResult.error) {
      const usersTeams = await getUsersTeams(request)
      const team = usersTeams.find((team) => team.teamId === teamId)

      await saveToCreate(request, h, {
        ...sanitisedPayload,
        ...(team && { teamName: team.name })
      })
      await setStepComplete(request, h, 'stepTwo')

      return h.redirect('/create/repository/summary')
    }
  }
}

export { repositoryDetailController }
