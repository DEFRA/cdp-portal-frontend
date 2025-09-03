import { populatePathParams } from '../../../../../../common/helpers/multistep-form/populate-path-params.js'

/** @type {Record<string, string>} */
const urlTemplates = {
  stepOne: '/admin/permissions/{scopeId}/user/find/{multiStepFormId?}',
  stepTwo:
    '/admin/permissions/{scopeId}/user/{userId}/team-scope/{multiStepFormId}',
  stepThree:
    '/admin/permissions/{scopeId}/user/{userId}/summary/{multiStepFormId}'
}

/**
 * User permissions step data
 * @typedef {object} StepData
 * @property {string} id multistep form id
 * @property {string} searchQuery user find search query
 * @property {string} userId user id the permission is being applied to
 * @property {"user"|"team"} scope scope for the user permission
 * @property {string} teamId team id to scope user permission to
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
 * @param {StepData | object} stepData
 * @param {Function} isMultistepComplete
 * @returns {Array<FormStep>}
 */
function formSteps({
  path,
  params,
  stepData = {},
  isMultistepComplete = () => ({})
}) {
  const isComplete = isMultistepComplete(stepData)
  const pathParams = {
    ...stepData,
    ...params
  }

  const stepOneUrl = populatePathParams(pathParams, urlTemplates.stepOne)
  const stepTwoUrl = populatePathParams(pathParams, urlTemplates.stepTwo)
  const stepThreeUrl = populatePathParams(pathParams, urlTemplates.stepThree)

  return [
    {
      url: stepOneUrl,
      isComplete: isComplete.stepOne,
      isCurrent: path.startsWith(stepOneUrl),
      text: 'Find user'
    },
    {
      url: stepTwoUrl,
      isComplete: isComplete.stepTwo,
      isCurrent: path.endsWith(stepTwoUrl),
      text: 'Scope'
    },
    {
      isComplete: isComplete.stepThree,
      isCurrent: path.endsWith(stepThreeUrl),
      text: 'Summary'
    }
  ]
}

export { formSteps, urlTemplates }
