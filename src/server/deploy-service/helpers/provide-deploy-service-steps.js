import { isDeploymentComplete } from '~/src/server/deploy-service/helpers/is-deployment-complete'
import { appConfig } from '~/src/config'
import { calculateStepWidth } from '~/src/server/common/helpers/calculate-step-width'
import { sessionNames } from '~/src/server/common/constants/session-names'

function provideDeployServiceSteps(request, h) {
  const response = request.response
  const requestPath = request.path

  if (response.variety === 'view') {
    const deployment = request.yar.get(sessionNames.deployment)
    const isComplete = isDeploymentComplete(deployment)

    const urls = {
      stepOne: appConfig.get('appPathPrefix') + '/deploy-service/details',
      stepTwo: appConfig.get('appPathPrefix') + '/deploy-service/options',
      stepThree: appConfig.get('appPathPrefix') + '/deploy-service/summary',
      stepFour: appConfig.get('appPathPrefix') + '/deploy-service/deploy'
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
