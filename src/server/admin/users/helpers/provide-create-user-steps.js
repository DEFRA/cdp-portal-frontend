import { appConfig } from '~/src/config'
import { calculateStepWidth } from '~/src/server/common/helpers/calculate-step-width'
import { isCdpUserComplete } from '~/src/server/admin/users/helpers/is-cdp-user-complete'
import { sessionNames } from '~/src/server/common/constants/session-names'

function provideCreateUserSteps(request, h) {
  const response = request.response
  const requestPath = request.path

  if (response.variety === 'view') {
    const cdpUser = request.yar.get(sessionNames.cdpUser)
    const isComplete = isCdpUserComplete(cdpUser)

    const urls = {
      stepOne:
        appConfig.get('appPathPrefix') + '/admin/users/create/find-aad-user',
      stepTwo:
        appConfig.get('appPathPrefix') + '/admin/users/create/find-github-user',
      stepThree:
        appConfig.get('appPathPrefix') + '/admin/users/create/user-details',
      stepFour: appConfig.get('appPathPrefix') + '/admin/users/create/summary'
    }

    if (!response?.source?.context) {
      response.source.context = {}
    }

    response.source.context.stepNavigation = {
      classes: 'app-step-navigation--slim',
      width: calculateStepWidth(isComplete),
      steps: [
        {
          isComplete: isComplete.stepOne,
          isCurrent: requestPath.includes(urls.stepOne),
          text: 'AAD'
        },
        {
          isComplete: isComplete.stepTwo,
          isCurrent: requestPath.includes(urls.stepTwo),
          text: 'GitHub'
        },
        {
          isComplete: isComplete.stepThree,
          isCurrent: requestPath.includes(urls.stepThree),
          text: 'Details'
        },
        {
          isComplete: isComplete.stepFour,
          isCurrent: requestPath.includes(urls.stepFour),
          text: 'Summary'
        }
      ]
    }
  }

  return h.continue
}

export { provideCreateUserSteps }
