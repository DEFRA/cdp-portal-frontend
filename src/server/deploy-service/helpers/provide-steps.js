import { isDeploymentSessionComplete } from '~/src/server/deploy-service/helpers/is-deployment-session-complete'
import { appConfig } from '~/src/config'
import { calculateStepWidth } from '~/src/server/deploy-service/helpers/calculate-step-width'

function provideSteps(request, h) {
  const response = request.response
  const requestPath = request.path

  if (response.variety === 'view') {
    const deploymentSession = request.yar.get('deployment')
    const isComplete = isDeploymentSessionComplete(deploymentSession)

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

export { provideSteps }
