import { sessionNames } from '~/src/server/common/constants/session-names'
import { saveToCreate } from '~/src/server/create/helpers/form'
import { isCreateFeatureTemporaryDisabled } from '~/src/server/create/helpers/feature/create-feature-flag'

const startController = {
  handler: async (request, h) => {
    request.yar.clear(sessionNames.create)
    request.yar.clear(sessionNames.validationFailure)
    await request.yar.commit(h)

    if (isCreateFeatureTemporaryDisabled()) {
      return h.redirect('/create/disabled')
    }

    await saveToCreate(request, h, {})

    return h.redirect('/create/choose-kind')
  }
}

export { startController }
