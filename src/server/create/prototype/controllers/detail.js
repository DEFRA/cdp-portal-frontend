import qs from 'qs'

import { sessionNames } from '~/src/server/common/constants/session-names.js'
import { getUsersTeams } from '~/src/server/common/helpers/user/get-users-teams.js'
import {
  saveToCreate,
  setStepComplete
} from '~/src/server/create/helpers/form/index.js'
import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details.js'
import { prototypeValidation } from '~/src/server/create/prototype/schema/prototype-validation.js'

const prototypeDetailController = {
  handler: async (request, h) => {
    const payload = request?.payload
    const repositoryName = payload.repositoryName
    const repositoryVisibility = payload.repositoryVisibility
    const templateTag = payload.templateTag ?? ''
    const teamId = payload.teamId
    const redirectLocation = payload?.redirectLocation

    const validationResult = await prototypeValidation()
      .validateAsync(payload, { abortEarly: false })
      .then((value) => ({ value }))
      .catch((error) => ({ value: payload, error }))

    const sanitisedPayload = {
      repositoryName,
      repositoryVisibility,
      teamId,
      templateTag
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

      return h.redirect(`/create/prototype/detail${queryString}`)
    }

    if (!validationResult.error) {
      const usersTeams = await getUsersTeams(request)
      const team = usersTeams.find((userTeam) => userTeam.teamId === teamId)

      await saveToCreate(request, h, {
        ...sanitisedPayload,
        ...(team && { teamName: team.name })
      })
      await setStepComplete(request, h, 'stepTwo')

      return h.redirect('/create/prototype/summary')
    }
  }
}

export { prototypeDetailController }
