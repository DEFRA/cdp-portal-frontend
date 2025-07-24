import { calculateStepWidth } from '../form/calculate-step-width.js'

/**
 * @typedef {object} Options
 * @property {Function} formSteps - flow defined formSteps
 * @property {Record<string, string>} urls - flow urls
 * @property {string} classes - component classes
 * @param {Options} options
 * @returns {function(*, *): *}
 */
function provideSteps({ formSteps, urls, classes }) {
  return (request, h) => {
    const isMultistepComplete = (stepSessionData) => {
      return Object.keys(urls).reduce(
        (stepObj, key) => ({
          ...stepObj,
          [key]: stepSessionData?.isComplete?.[key]
        }),
        {}
      )
    }

    const multiStepFormId = request.app.multiStepFormId
    const response = request.response
    const stepData = request.yar.get(multiStepFormId)

    if (response.variety === 'view') {
      if (!response?.source?.context) {
        response.source.context = {}
      }

      const stepClasses = ['app-step-navigation--slim']

      if (classes) {
        stepClasses.push(classes)
      }

      response.source.context.stepNavigation = {
        classes: stepClasses.join(' '),
        width: calculateStepWidth(isMultistepComplete(stepData)),
        steps: formSteps(
          request.path,
          multiStepFormId,
          stepData,
          isMultistepComplete
        )
      }
    }

    return h.continue
  }
}

export { provideSteps }
