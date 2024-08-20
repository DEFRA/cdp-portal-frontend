/** @type {Record<string, string>} */
const urls = {
  stepOne: '/deploy-service/details',
  stepTwo: '/deploy-service/options',
  stepThree: '/deploy-service/summary'
}

/**
 * Deployment step data
 * @typedef {object} StepData
 * @property {string} id multistep form id
 * @property {string} imageName deployments image name
 * @property {string} version deployments version
 * @property {string} environment deployments environment
 * @property {string} instanceCount deployments instanceCount
 * @property {string} cpu deployments cpu
 * @property {string} memory deployments memory
 * @property {Record<string, boolean>} isComplete map for steps marked complete
 * @property {string} button form button name, one of "save", "next" or if not js, "search"
 * @property {string} [redirectLocation] the path to redirect to, if present this is "summary"
 */

/**
 * Form steps
 * @typedef {object} FormStep
 * @property {string} [url] - url path for the step. If not present, this is usually the last step
 * @property {boolean} isComplete - boolean automatically provided by the multistep-form session data
 * @property {boolean} isCurrent - boolean match on the steps url path
 * @property {string} text - Text for the step marker
 */

/**
 * Returns the objects that control the form steps
 * @param {string} path
 * @param {string} multiStepFormId
 * @param {StepData} stepData
 * @param {Function} isMultistepComplete
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
