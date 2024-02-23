import { calculateStepWidth } from '~/src/server/common/helpers/form/calculate-step-width'
import { sessionNames } from '~/src/server/common/constants/session-names'
import {
  deploymentSteps,
  isDeploymentComplete
} from '~/src/server/deploy-service/helpers/form/deployment-steps'

function provideDeploymentSteps(request, h) {
  const response = request.response
  const deployment = request.yar.get(sessionNames.deployment)

  if (response.variety === 'view') {
    if (!response?.source?.context) {
      response.source.context = {}
    }

    response.source.context.stepNavigation = {
      classes: 'app-step-navigation--slim',
      width: calculateStepWidth(isDeploymentComplete(deployment)),
      steps: deploymentSteps(request.path, deployment)
    }
  }

  return h.continue
}

export { provideDeploymentSteps }
