import { sessionNames } from '~/src/server/common/constants/session-names'
import { saveToCreate } from '~/src/server/create/helpers/form'
import { isCreateServiceFeatureDisabled } from '~/src/server/create/helpers/feature-toggle/create-service-disabled'

const createDisabledProperties = {
  pageTitle: 'Unavailable - Create a Service is undergoing maintenance',
  heading: 'Create a Service is undergoing maintenance',
  mainBody: ['It will be available to use again shortly.']
}

const startController = {
  handler: async (request, h) => {
    const createDisabled = await isCreateServiceFeatureDisabled(request)
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
