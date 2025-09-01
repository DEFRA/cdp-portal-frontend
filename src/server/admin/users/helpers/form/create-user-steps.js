const urls = {
  stepOne: '/admin/users/find-aad-user',
  stepTwo: '/admin/users/find-github-user',
  stepThree: '/admin/users/summary'
}

function createSteps(path, cdpUser) {
  const isComplete = isCreateCdpUserComplete(cdpUser)

  return [
    {
      url: urls.stepOne,
      isComplete: isComplete.stepOne,
      isCurrent: path.includes(urls.stepOne),
      text: 'DEFRA User'
    },
    {
      url: urls.stepTwo,
      isComplete: isComplete.stepTwo,
      isCurrent: path.includes(urls.stepTwo),
      text: 'GitHub User'
    },
    {
      isComplete: isComplete.allSteps,
      isCurrent: path.includes(urls.stepThree),
      text: 'Summary'
    }
  ]
}

function isCreateCdpUserComplete(cdpUser) {
  return {
    stepOne: cdpUser?.isComplete?.stepOne,
    stepTwo: cdpUser?.isComplete?.stepTwo,
    stepThree: cdpUser?.isComplete?.allSteps
  }
}

export { createSteps, isCreateCdpUserComplete }
