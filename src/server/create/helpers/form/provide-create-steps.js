import { calculateStepWidth } from '../../../common/helpers/form/calculate-step-width.js'
import { createSteps, isCreateComplete } from './create-steps.js'
import { sessionNames } from '../../../common/constants/session-names.js'

function provideCreateSteps(request, h) {
  const response = request.response
  const create = request.yar.get(sessionNames.create)

  if (response.variety === 'view') {
    if (!response?.source?.context) {
      response.source.context = {}
    }

    response.source.context.stepNavigation = {
      classes: 'app-step-navigation--slim',
      width: calculateStepWidth(isCreateComplete(create)),
      steps: createSteps(request.path, create)
    }
  }

  return h.continue
}

export { provideCreateSteps }
