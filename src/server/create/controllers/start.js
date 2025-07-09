import { sessionNames } from '~/src/server/common/constants/session-names.js'
import { saveToCreate } from '~/src/server/create/helpers/form/index.js'
import { isFeatureToggleActive } from '~/src/server/common/helpers/feature-toggle/feature-toggle-lookup.js'

const createDisabledProperties = {
  pageTitle: 'Unavailable - Create a Service is undergoing maintenance',
  heading: 'Create a Service is undergoing maintenance',
  mainBody: ['It will be available to use again shortly.']
}

const startController = {
  options: {
    id: 'create'
  },
  handler: async (request, h) => {
    const createDisabled = await isFeatureToggleActive(
      request.featureToggles,
      'create-service-disabled'
    )
    if (createDisabled) {
      return h.view('common/views/disabled', createDisabledProperties)
    }

    request.yar.clear(sessionNames.create)
    request.yar.clear(sessionNames.validationFailure)
    await request.yar.commit(h)

    await saveToCreate(request, h, {})

    return h.redirect('/create/choose-kind')
  }
}

export { startController }
