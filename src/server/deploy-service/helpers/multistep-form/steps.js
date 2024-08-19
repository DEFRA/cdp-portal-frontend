const urls = {
  stepOne: '/deploy-service/details',
  stepTwo: '/deploy-service/options',
  stepThree: '/deploy-service/summary'
}

function formSteps(path, multiStepFormId, stepData) {
  const isComplete = isMultistepComplete(stepData)
  const withId = (url) => `${url}/${multiStepFormId}`

  return [
    {
      url: withId(urls.stepOne),
      isComplete: isComplete.stepOne,
      isCurrent: path.startsWith(urls.stepOne),
      text: 'Details'
    },
    {
      url: withId(urls.stepTwo),
      isComplete: isComplete.stepTwo,
      isCurrent: path.endsWith(withId(urls.stepTwo)),
      text: 'Options'
    },
    {
      isComplete: isComplete.allSteps,
      isCurrent: path.endsWith(withId(urls.stepThree)),
      text: 'Summary'
    }
  ]
}

/**
 *
 * @param {string} path
 * @returns {string|undefined}
 */
function getStepByPath(path) {
  const result = Object.entries(urls).find(([, url]) => path.startsWith(url))
  return result.at(0)
}

function isMultistepComplete(stepData) {
  return {
    stepOne: stepData?.isComplete?.stepOne,
    stepTwo: stepData?.isComplete?.stepTwo,
    stepThree: stepData?.isComplete?.allSteps
  }
}

export { formSteps, isMultistepComplete, getStepByPath }
