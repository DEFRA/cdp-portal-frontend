import { calculateStepWidth } from '~/src/server/common/helpers/calculate-step-width'
import { sessionNames } from '~/src/server/common/constants/session-names'
import {
  createUrls,
  createSteps,
  isCreateCdpUserComplete
} from '~/src/server/admin/users/helpers/form/create-user-steps'
import {
  editUrls,
  editSteps,
  isEditCdpUserComplete
} from '~/src/server/admin/users/helpers/form/edit-user-steps'

const stepChooser = (isEdit) => {
  if (isEdit) {
    return {
      isComplete: isEditCdpUserComplete,
      urls: editUrls,
      steps: editSteps
    }
  }

  return {
    isComplete: isCreateCdpUserComplete,
    urls: createUrls,
    steps: createSteps
  }
}

function provideUserSteps(request, h) {
  const response = request.response
  const requestPath = request.path

  if (response.variety === 'view') {
    const cdpUser = request.yar.get(sessionNames.cdpUser)

    const isEdit = cdpUser?.isEdit ?? false
    const journey = stepChooser(isEdit)

    const isComplete = journey.isComplete(cdpUser)
    const urls = journey.urls

    if (!response?.source?.context) {
      response.source.context = {}
    }

    response.source.context.stepNavigation = {
      classes: 'app-step-navigation--slim',
      width: calculateStepWidth(isComplete),
      steps: journey.steps(requestPath, urls, isComplete)
    }
  }

  return h.continue
}

export { provideUserSteps }
