import { populatePathParams } from '../../../common/helpers/multistep-form/populate-path-params.js'

/** @type {Record<string, string>} */
const urlTemplates = {
  stepOne: '/deploy-service/details/{multiStepFormId?}',
  stepTwo: '/deploy-service/options/{multiStepFormId}',
  stepThree: '/deploy-service/summary/{multiStepFormId}'
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
 * @param {Record<string, boolean>} params
 * @param {StepData | null} stepData
 * @param {Function} isMultistepComplete
 * @returns {Array<FormStep>}
 */
function formSteps({
  path,
  params,
  stepData = null,
  isMultistepComplete = () => ({})
}) {
  const isComplete = isMultistepComplete(stepData)

  const stepOneUrl = populatePathParams(params, urlTemplates.stepOne)
  const stepTwoUrl = populatePathParams(params, urlTemplates.stepTwo)
  const stepThreeUrl = populatePathParams(params, urlTemplates.stepThree)

  return [
    {
      url: stepOneUrl,
      isComplete: isComplete.stepOne,
      isCurrent: path.startsWith(stepOneUrl),
      text: 'Details'
    },
    {
      url: stepTwoUrl,
      isComplete: isComplete.stepTwo,
      isCurrent: path.endsWith(stepTwoUrl),
      text: 'Options'
    },
    {
      isComplete: isComplete.stepThree,
      isCurrent: path.endsWith(stepThreeUrl),
      text: 'Summary'
    }
  ]
}

export { formSteps, urlTemplates }
