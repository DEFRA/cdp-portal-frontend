import { calculateStepWidth } from '~/src/server/common/helpers/form/calculate-step-width'

/**
 *
 * @param {function} formSteps - flow defined formSteps
 * @param {function} isMultistepComplete - flow defined isMultistepComplete
 * @returns {function(*, *): *}
 */
function provideSteps(formSteps, isMultistepComplete) {
  return (request, h) => {
    const multiStepFormId = request.app.multiStepFormId
    const response = request.response
    const stepData = request.yar.get(multiStepFormId)

    if (response.variety === 'view') {
      if (!response?.source?.context) {
        response.source.context = {}
      }

      response.source.context.stepNavigation = {
        classes: 'app-step-navigation--slim',
        width: calculateStepWidth(isMultistepComplete(stepData)),
        steps: formSteps(request.path, multiStepFormId, stepData)
      }
    }

    return h.continue
  }
}

export { provideSteps }
