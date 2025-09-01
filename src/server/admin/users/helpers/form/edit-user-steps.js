// When editing don't give the user the choice to update the first step, the aad user
const urls = {
  stepTwo: '/admin/users/find-github-user',
  stepThree: '/admin/users/summary'
}

function editSteps(path, cdpUser) {
  const isComplete = isEditCdpUserComplete(cdpUser)

  return [
    {
      url: urls.stepTwo,
      isComplete: isComplete.stepTwo,
      isCurrent: path.includes(urls.stepTwo),
      text: 'GitHub User'
    },
    {
      url: urls.stepThree,
      isComplete: isComplete.stepThree,
      isCurrent: path.includes(urls.stepThree),
      text: 'User Details'
    },
    {
      isComplete: isComplete.allSteps,
      isCurrent: path.includes(urls.stepFour),
      text: 'Summary'
    }
  ]
}

function isEditCdpUserComplete(cdpUser) {
  return {
    stepTwo: cdpUser?.isComplete?.stepTwo,
    stepThree: cdpUser?.isComplete?.stepThree,
    stepFour: cdpUser?.isComplete?.allSteps
  }
}

export { editSteps, isEditCdpUserComplete }
