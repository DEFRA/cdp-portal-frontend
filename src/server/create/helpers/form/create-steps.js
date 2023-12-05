const urls = {
  stepOne: '/create/choose-kind',
  stepTwo: (kind) => `/create/${kind}-detail`,
  stepThree: (kind) => `/create/${kind}/summary`
}

function createSteps(path, create) {
  const isComplete = isCreateComplete(create)
  const kind = create?.kind

  const urlStepTwo = urls.stepTwo(kind)
  const urlStepThree = urls.stepThree(kind)

  return [
    {
      url: urls.stepOne,
      isComplete: isComplete.stepOne,
      isCurrent: path.endsWith(urls.stepOne),
      text: 'Create'
    },
    {
      url: urlStepTwo,
      isComplete: isComplete.stepTwo,
      isCurrent: path.endsWith(urlStepTwo),
      text: 'Details'
    },
    {
      isComplete: isComplete.allSteps,
      isCurrent: path.endsWith(urlStepThree),
      text: 'Summary'
    }
  ]
}

function isCreateComplete(create) {
  return {
    stepOne: create?.isComplete?.stepOne,
    stepTwo: create?.isComplete?.stepTwo,
    stepThree: create?.isComplete?.allSteps
  }
}

export { createSteps, isCreateComplete }
