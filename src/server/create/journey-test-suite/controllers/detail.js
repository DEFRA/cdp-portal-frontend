import qs from 'qs'

import { sessionNames } from '../../../common/constants/session-names.js'
import { getUsersTeams } from '../../../common/helpers/user/get-users-teams.js'
import { saveToCreate, setStepComplete } from '../../helpers/form/index.js'
import { buildErrorDetails } from '../../../common/helpers/build-error-details.js'
import { testSuiteValidation } from '../../helpers/schema/test-suite-validation.js'

const testSuiteDetailController = {
  handler: async (request, h) => {
    const payload = request?.payload
    payload.repositoryName = payload.repositoryName?.trim()

    const {
      repositoryName,
      repositoryVisibility,
      templateTag,
      teamId,
      redirectLocation
    } = payload

    const validationResult = await testSuiteValidation()
      .validateAsync(payload, { abortEarly: false })
      .then((value) => ({ value }))
      .catch((error) => ({ value: payload, error }))

    const sanitisedPayload = {
      repositoryName,
      repositoryVisibility,
      teamId,
      templateTag: templateTag ?? ''
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

      return h.redirect(`/create/journey-test-suite/detail${queryString}`)
    }

    if (!validationResult.error) {
      const usersTeams = await getUsersTeams(request)
      const team = usersTeams.find((userTeam) => userTeam.teamId === teamId)

      await saveToCreate(request, h, {
        ...sanitisedPayload,
        ...(team && { teamName: team.name })
      })
      await setStepComplete(request, h, 'stepTwo')

      return h.redirect('/create/journey-test-suite/summary')
    }
  }
}

export { testSuiteDetailController }
