import { sessionNames } from '~/src/server/common/constants/session-names'
import { saveToCreate } from '~/src/server/create/helpers/form'
import { isCreateFeatureTemporaryDisabled } from '~/src/server/create/helpers/feature-toggle/create-feature-flag'

const createDisabledProperties = {
  pageTitle: 'Create a Service is unavailable',
  heading: 'Sorry, this feature is unavailable',
  subHeading: 'Create a Service is undergoing maintenance',
  mainBody: ['It will be available to use again shortly.']
}

const startController = {
  handler: async (request, h) => {
    const createDisabled = await isCreateFeatureTemporaryDisabled(request)
    if (createDisabled) {
      return h.view('create/views/disabled', createDisabledProperties)
    }

    request.yar.clear(sessionNames.create)
    request.yar.clear(sessionNames.validationFailure)
    await request.yar.commit(h)

    await saveToCreate(request, h, {})

    return h.redirect('/create/choose-kind')
  }
}

export { startController }
