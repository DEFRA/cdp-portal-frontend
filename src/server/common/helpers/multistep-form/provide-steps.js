import { calculateStepWidth } from '../form/calculate-step-width.js'

/**
 * Checks if the multistep form is complete based on the stepData
 * @param {Record<string, string>} urlTemplates - flow url templates
 * @returns {function(*): *}
 */
function isMultistepFormComplete(urlTemplates) {
  return (stepData) =>
    Object.keys(urlTemplates).reduce(
      (stepObj, key) => ({
        ...stepObj,
        [key]: stepData?.isComplete?.[key]
      }),
      {}
    )
}

/**
 * @param {Function} formSteps - flow defined formSteps
 * @param {Record<string, string>} urlTemplates - flow urls
 * @param {string} classes - component classes
 * @returns {function(*, *): *}
 */
function provideSteps({ formSteps, urlTemplates, classes }) {
  return (request, h) => {
    const multiStepFormId = request.app.multiStepFormId
    const response = request.response
    const stepData = request.yar.get(multiStepFormId) ?? {}
    const isMultistepComplete = isMultistepFormComplete(urlTemplates)

    if (response.variety === 'view') {
      if (!response?.source?.context) {
        response.source.context = {}
      }

      const { path, params } = request
      const stepClasses = ['app-step-navigation--slim']

      if (classes) {
        stepClasses.push(classes)
      }

      response.source.context.stepNavigation = {
        classes: stepClasses.join(' '),
        width: calculateStepWidth(isMultistepComplete(stepData)),
        steps: formSteps({
          path,
          params,
          stepData,
          isMultistepComplete
        })
      }
    }

    return h.continue
  }
}

export { provideSteps }
