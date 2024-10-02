import { sessionNames } from '~/src/server/common/constants/session-names'
import { saveToCreate } from '~/src/server/create/helpers/form'
import { isCreateFeatureTemporaryDisabled } from '~/src/server/create/helpers/feature-toggle/create-feature-flag'

const startController = {
  handler: async (request, h) => {
    const createDisabled = await isCreateFeatureTemporaryDisabled(request)
    if (createDisabled) {
      return h.view('create/views/disabled', {
        pageTitle: 'Sorry, this feature is unavailable – create-service-flow',
        heading: 'Sorry, this feature is unavailable',
        mainBody: 'You will be able to use this section of the portal later.'
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
