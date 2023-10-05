import { config } from '~/src/config'

const createUrls = {
  stepOne: config.get('appPathPrefix') + '/admin/users/find-aad-user',
  stepTwo: config.get('appPathPrefix') + '/admin/users/find-github-user',
  stepThree: config.get('appPathPrefix') + '/admin/users/user-details',
  stepFour: config.get('appPathPrefix') + '/admin/users/summary'
}

const createSteps = (requestPath, urls, isComplete) => [
  {
    url: urls.stepOne,
    isComplete: isComplete.stepOne,
    isCurrent: requestPath.includes(urls.stepOne),
    text: 'AAD'
  },
  {
    url: urls.stepTwo,
    isComplete: isComplete.stepTwo,
    isCurrent: requestPath.includes(urls.stepTwo),
    text: 'Github user'
  },
  {
    url: urls.stepThree,
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
