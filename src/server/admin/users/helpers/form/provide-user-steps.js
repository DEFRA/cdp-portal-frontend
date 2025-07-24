import { calculateStepWidth } from '../../../../common/helpers/form/calculate-step-width.js'
import { sessionNames } from '../../../../common/constants/session-names.js'
import { createSteps, isCreateCdpUserComplete } from './create-user-steps.js'
import { editSteps, isEditCdpUserComplete } from './edit-user-steps.js'

function steps(isEdit) {
  return isEdit ? editSteps : createSteps
}

function stepWidthCalculation(isEdit) {
  return isEdit ? isEditCdpUserComplete : isCreateCdpUserComplete
}

function provideUserSteps(request, h) {
  const response = request.response
  const cdpUser = request.yar.get(sessionNames.cdpUser)
  const isEdit = cdpUser?.isEdit ?? false

  if (response.variety === 'view') {
    if (!response?.source?.context) {
      response.source.context = {}
    }

    response.source.context.stepNavigation = {
      classes: 'app-step-navigation--slim',
      width: calculateStepWidth(stepWidthCalculation(isEdit)(cdpUser)),
      steps: steps(isEdit)(request.path, cdpUser)
    }
  }

  return h.continue
}

export { provideUserSteps }
