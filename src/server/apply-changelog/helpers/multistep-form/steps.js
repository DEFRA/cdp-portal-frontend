import { populatePathParams } from '../../../common/helpers/multistep-form/populate-path-params.js'

/** @type {Record<string, string>} */
const urlTemplates = {
  stepOne: '/apply-changelog/change-details/{multiStepFormId?}',
  stepTwo: '/apply-changelog/summary/{multiStepFormId}'
}

/**
 * Update database step data
 * @typedef {object} StepData
 * @property {string} id multistep form id
 * @property {string} serviceName service name
 * @property {string} migrationVersion db update version
 * @property {string} environment db update environment
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

  return [
    {
      url: stepOneUrl,
      isComplete: isComplete.stepOne,
      isCurrent: path.startsWith(stepOneUrl),
      text: 'Details'
    },
    {
      isComplete: isComplete.stepTwo,
      isCurrent: path.endsWith(stepTwoUrl),
      text: 'Summary'
    }
  ]
}

export { formSteps, urlTemplates }
