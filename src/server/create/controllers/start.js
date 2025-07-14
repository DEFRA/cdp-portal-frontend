import { sessionNames } from '~/src/server/common/constants/session-names.js'
import { saveToCreate } from '~/src/server/create/helpers/form/index.js'

const startController = {
  options: {
    id: 'create'
  },
  handler: async (request, h) => {
    request.yar.clear(sessionNames.create)
    request.yar.clear(sessionNames.validationFailure)
    await request.yar.commit(h)

    await saveToCreate(request, h, {})

    return h.redirect('/create/choose-kind')
  }
}

export { startController }
