import qs from 'qs'

import { sessionNames } from '../../../common/constants/session-names.js'
import { getUsersTeams } from '../../../common/helpers/user/get-users-teams.js'
import { buildErrorDetails } from '../../../common/helpers/build-error-details.js'
import { testSuiteValidation } from '../../helpers/schema/test-suite-validation.js'

const perfTestSuiteDetailController = {
  handler: async (request, h) => {
    const payload = request?.payload
    payload.repositoryName = payload.repositoryName.trim()

    const { repositoryName, teamId, templateTag, redirectLocation } = payload

    const validationResult = await testSuiteValidation()
      .validateAsync(payload, { abortEarly: false })
      .then((value) => ({ value }))
      .catch((error) => ({ value: payload, error }))

    const sanitisedPayload = {
      repositoryName,
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

      return h.redirect(`/create/perf-test-suite/detail${queryString}`)
    }

    if (!validationResult.error) {
      const usersTeams = await getUsersTeams(request)
      const team = usersTeams.find((team) => team.teamId === teamId)

      await request.app.saveStepData(
        {
          ...sanitisedPayload,
          ...(team && { teamName: team.name })
        },
        h
      )

      return h.redirect('/create/perf-test-suite/summary')
    }
  }
}

export { perfTestSuiteDetailController }
