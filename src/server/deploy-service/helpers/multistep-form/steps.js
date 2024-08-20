const urls = {
  stepOne: '/deploy-service/details',
  stepTwo: '/deploy-service/options',
  stepThree: '/deploy-service/summary'
}

/**
 * Form steps
 * @typedef {Object} FormStep
 * @property {string} [url] - url path for the step. If not present, this is usually the last step
 * @property {boolean} isComplete - boolean automatically provided by the multistep-form session data
 * @property {boolean} isCurrent - boolean match on the steps url path
 * @property {string} text - Text for the step marker
 */

/**
 * Returns the objects that control the form steps
 * @param path
 * @param multiStepFormId
 * @param stepData
 * @param isMultistepComplete
 * @returns {Array<FormStep>}
 */
function formSteps(path, multiStepFormId, stepData, isMultistepComplete) {
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
      isComplete: isComplete.stepThree,
      isCurrent: path.endsWith(withId(urls.stepThree)),
      text: 'Summary'
    }
  ]
}

export { formSteps, urls }
