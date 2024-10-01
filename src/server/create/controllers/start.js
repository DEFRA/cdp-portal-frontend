import { sessionNames } from '~/src/server/common/constants/session-names'
import { saveToCreate } from '~/src/server/create/helpers/form'
import { isCreateFeatureTemporaryDisabled } from '~/src/server/create/helpers/feature-toggle/create-feature-flag'

const startController = {
  handler: async (request, h) => {
    if (isCreateFeatureTemporaryDisabled(request)) {
      request.logger.debug('Create feature is disabled')
      return h.view('create/views/disabled', {
        pageTitle: 'Create disabled',
        heading: 'Create service disabled'
      })
    }

    request.yar.clear(sessionNames.create)
    request.yar.clear(sessionNames.validationFailure)
    await request.yar.commit(h)

    await saveToCreate(request, h, {})

    return h.redirect('/create/choose-kind')
  }
}

export { startController }
