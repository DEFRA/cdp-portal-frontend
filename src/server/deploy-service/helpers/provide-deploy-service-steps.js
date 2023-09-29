import { isDeploymentComplete } from '~/src/server/deploy-service/helpers/is-deployment-complete'
import { config } from '~/src/config'
import { calculateStepWidth } from '~/src/server/common/helpers/calculate-step-width'
import { sessionNames } from '~/src/server/common/constants/session-names'

function provideDeployServiceSteps(request, h) {
  const response = request.response
  const requestPath = request.path

  if (response.variety === 'view') {
    const deployment = request.yar.get(sessionNames.deployment)
    const isComplete = isDeploymentComplete(deployment)

    const urls = {
      stepOne: config.get('appPathPrefix') + '/deploy-service/details',
      stepTwo: config.get('appPathPrefix') + '/deploy-service/options',
      stepThree: config.get('appPathPrefix') + '/deploy-service/summary',
      stepFour: config.get('appPathPrefix') + '/deploy-service/deploy'
    }

    if (!response?.source?.context) {
      response.source.context = {}
    }

    response.source.context.stepNavigation = {
      width: calculateStepWidth(isComplete),
      steps: [
        {
          isComplete: isComplete.stepOne,
          isCurrent: requestPath.includes(urls.stepOne),
          text: 'Details'
        },
        {
          isComplete: isComplete.stepTwo,
          isCurrent: requestPath.includes(urls.stepTwo),
          text: 'Options'
        },
        {
          isComplete: isComplete.stepThree,
          isCurrent: requestPath.includes(urls.stepThree),
          text: 'Summary'
        },
        {
          isComplete: isComplete.stepFour,
          isCurrent: requestPath.includes(urls.stepFour),
          text: 'Deployment'
        }
      ]
    }
  }

  return h.continue
}

export { provideDeployServiceSteps }
