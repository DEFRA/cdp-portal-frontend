import { appConfig } from '~/src/config'

// When editing don't give the user the choice to update the first step, the aad user
const editUrls = {
  stepTwo:
    appConfig.get('appPathPrefix') + '/admin/users/create/find-github-user',
  stepThree:
    appConfig.get('appPathPrefix') + '/admin/users/create/user-details',
  stepFour: appConfig.get('appPathPrefix') + '/admin/users/create/summary'
}

const editSteps = (requestPath, urls, isComplete) => [
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
    isComplete: isComplete.allSteps,
    isCurrent: requestPath.includes(urls.stepFour),
    text: 'Summary'
  }
]

function isEditCdpUserComplete(cdpUser) {
  return {
    stepTwo: cdpUser?.isComplete?.stepTwo,
    stepThree: cdpUser?.isComplete?.stepThree,
    stepFour: cdpUser?.isComplete?.allSteps
  }
}

export { editUrls, editSteps, isEditCdpUserComplete }
