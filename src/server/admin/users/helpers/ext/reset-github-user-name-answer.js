import { isUndefined, omit } from 'lodash'

import { sessionNames } from '~/src/server/common/constants/session-names'

const resetGithubUserNameAnswer = {
  method: async (request, h) => {
    const cdpUser = request.yar.get(sessionNames.cdpUser)
    const githubSearch = request.query?.githubSearch || null

    if (request.isXhr()) {
      // If githubSearch is empty and session holds a value for github username. Remove github from session
      if (!githubSearch && !isUndefined(cdpUser?.github)) {
        request.yar.set(sessionNames.cdpUser, omit(cdpUser, ['github']))
        await request.yar.commit(h)
      }
    }
    return h.continue
  }
}

export { resetGithubUserNameAnswer }
