import { omit } from 'lodash'

import { sessionNames } from '~/src/server/common/constants/session-names'

const resetAadAnswer = {
  method: (request, h) => {
    const cdpUser = request.yar.get(sessionNames.cdpUser)
    const emailSearch = request.query?.emailSearch ?? null

    if (request.isXhr()) {
      // If emailSearch is empty and session holds email and userId. Remove both emailSearch, email and userId
      if (!emailSearch && cdpUser?.email && cdpUser?.userId) {
        request.yar.set(
          sessionNames.cdpUser,
          omit(cdpUser, ['emailSearch', 'email', 'userId'])
        )
        request.yar.commit(h)
      }
    }
    return h.continue
  }
}

export { resetAadAnswer }
