import { calculateStepWidth } from '~/src/server/common/helpers/calculate-step-width'
import { sessionNames } from '~/src/server/common/constants/session-names'
import {
  teamUrls,
  teamSteps,
  isCdpTeamComplete
} from '~/src/server/admin/teams/helpers/form/team-steps'

function provideTeamSteps(request, h) {
  const response = request.response
  const requestPath = request.path

  if (response.variety === 'view') {
    const cdpTeam = request.yar.get(sessionNames.cdpTeam)
    const journey = {
      isComplete: isCdpTeamComplete,
      urls: teamUrls,
      steps: teamSteps
    }

    const isComplete = journey.isComplete(cdpTeam)
    const urls = journey.urls

    if (!response?.source?.context) {
      response.source.context = {}
    }

    response.source.context.stepNavigation = {
      classes: 'app-step-navigation--slim',
      width: calculateStepWidth(isComplete),
      steps: journey.steps(requestPath, urls, isComplete)
    }
  }

  return h.continue
}

export { provideTeamSteps }
