import { calculateStepWidth } from '~/src/server/common/helpers/calculate-step-width'
import {
  createSteps,
  isCreateComplete
} from '~/src/server/create/helpers/form/create-steps'
import { sessionNames } from '~/src/server/common/constants/session-names'

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
