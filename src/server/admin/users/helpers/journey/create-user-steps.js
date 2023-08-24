import { appConfig } from '~/src/config'

const createUrls = {
  stepOne: appConfig.get('appPathPrefix') + '/admin/users/create/find-aad-user',
  stepTwo:
    appConfig.get('appPathPrefix') + '/admin/users/create/find-github-user',
  stepThree:
    appConfig.get('appPathPrefix') + '/admin/users/create/user-details',
  stepFour: appConfig.get('appPathPrefix') + '/admin/users/create/summary'
}

const createSteps = (requestPath, urls, isComplete) => [
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
    isComplete: isComplete.allSteps,
    isCurrent: requestPath.includes(urls.stepFour),
    text: 'Summary'
  }
]

function isCreateCdpUserComplete(cdpUser) {
  return {
    stepOne: cdpUser?.isComplete?.stepOne,
    stepTwo: cdpUser?.isComplete?.stepTwo,
    stepThree: cdpUser?.isComplete?.stepThree,
    stepFour: cdpUser?.isComplete?.allSteps
  }
}

export { createUrls, createSteps, isCreateCdpUserComplete }
