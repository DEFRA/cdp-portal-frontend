const urls = {
  stepOne: '/admin/users/find-aad-user',
  stepTwo: '/admin/users/find-github-user',
  stepThree: '/admin/users/user-details',
  stepFour: '/admin/users/summary'
}

function createSteps(path, cdpUser) {
  const isComplete = isCreateCdpUserComplete(cdpUser)

  return [
    {
      url: urls.stepOne,
      isComplete: isComplete.stepOne,
      isCurrent: path.includes(urls.stepOne),
      text: 'AAD'
    },
    {
      url: urls.stepTwo,
      isComplete: isComplete.stepTwo,
      isCurrent: path.includes(urls.stepTwo),
      text: 'GitHub user'
    },
    {
      url: urls.stepThree,
      isComplete: isComplete.stepThree,
      isCurrent: path.includes(urls.stepThree),
      text: 'Details'
    },
    {
      isComplete: isComplete.allSteps,
      isCurrent: path.includes(urls.stepFour),
      text: 'Summary'
    }
  ]
}

function isCreateCdpUserComplete(cdpUser) {
  return {
    stepOne: cdpUser?.isComplete?.stepOne,
    stepTwo: cdpUser?.isComplete?.stepTwo,
    stepThree: cdpUser?.isComplete?.stepThree,
    stepFour: cdpUser?.isComplete?.allSteps
  }
}

export { createSteps, isCreateCdpUserComplete }
