import { calculateStepWidth } from '~/src/server/common/helpers/form/calculate-step-width'

/**
 *
 * @param {function} formSteps - flow defined formSteps
 * @param {Record<string, string>} urls - flow urls
 * @returns {function(*, *): *}
 */
function provideSteps(formSteps, urls) {
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

      response.source.context.stepNavigation = {
        classes: 'app-step-navigation--slim',
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
