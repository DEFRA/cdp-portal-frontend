import { calculateStepWidth } from '~/src/server/common/helpers/form/calculate-step-width'
import { sessionNames } from '~/src/server/common/constants/session-names'
import {
  createSteps,
  isCreateCdpUserComplete
} from '~/src/server/admin/users/helpers/form/create-user-steps'
import {
  editSteps,
  isEditCdpUserComplete
} from '~/src/server/admin/users/helpers/form/edit-user-steps'

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
