import { sessionNames } from '~/src/server/common/constants/session-names'
import { saveToCreate } from '~/src/server/create/helpers/form'

const startController = {
  handler: async (request, h) => {
    request.yar.clear(sessionNames.create)
    request.yar.clear(sessionNames.validationFailure)
    await request.yar.commit(h)

    await saveToCreate(request, h, {})

    return h.redirect('/create/choose-kind')
  }
}

export { startController }
