import { calculateStepWidth } from '~/src/server/common/helpers/calculate-step-width'
import { sessionNames } from '~/src/server/common/constants/session-names'
import {
  deploymentUrls,
  deploymentSteps,
  isDeploymentComplete
} from '~/src/server/deploy-service/helpers/form/deployment-steps'

function provideDeploymentSteps(request, h) {
  const response = request.response
  const requestPath = request.path

  if (response.variety === 'view') {
    const deployment = request.yar.get(sessionNames.deployment)
    const journey = {
      isComplete: isDeploymentComplete,
      urls: deploymentUrls,
      steps: deploymentSteps
    }

    const isComplete = journey.isComplete(deployment)
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

export { provideDeploymentSteps }
