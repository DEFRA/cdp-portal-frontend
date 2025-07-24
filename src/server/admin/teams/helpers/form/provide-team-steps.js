import { calculateStepWidth } from '../../../../common/helpers/form/calculate-step-width.js'
import { teamSteps, isCdpTeamComplete } from './team-steps.js'
import { sessionNames } from '../../../../common/constants/session-names.js'

function provideTeamSteps(request, h) {
  const response = request.response
  const cdpTeam = request.yar.get(sessionNames.cdpTeam)

  if (response.variety === 'view') {
    if (!response?.source?.context) {
      response.source.context = {}
    }

    response.source.context.stepNavigation = {
      classes: 'app-step-navigation--slim',
      width: calculateStepWidth(isCdpTeamComplete(cdpTeam)),
      steps: teamSteps(request.path, cdpTeam)
    }
  }

  return h.continue
}

export { provideTeamSteps }
