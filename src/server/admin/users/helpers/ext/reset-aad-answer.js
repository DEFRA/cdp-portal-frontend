import omit from 'lodash/omit.js'

import { sessionNames } from '../../../../common/constants/session-names.js'

const resetAadAnswer = {
  method: async (request, h) => {
    const cdpUser = request.yar.get(sessionNames.cdpUser)
    const aadQuery = request.query?.aadQuery ?? null

    if (request.isXhr()) {
      // If aadQuery is empty and session holds email and userId. Remove both aadQuery, email and userId
      if (!aadQuery && cdpUser?.email && cdpUser?.userId) {
        request.yar.set(
          sessionNames.cdpUser,
          omit(cdpUser, ['aadQuery', 'email', 'userId'])
        )
        await request.yar.commit(h)
      }
    }
    return h.continue
  }
}

export { resetAadAnswer }
