import { sessionNames } from '#server/common/constants/session-names.js'

export default {
  type: 'onPreAuth',
  method: (request, h) => {
    const basket = request.yar.get(sessionNames.resourcesBasket)

    if (!basket) return h.redirect('/create').takeover()

    return h.continue
  },
  options: { sandbox: 'plugin' }
}
