import { isUndefined, omit } from 'lodash'

import { sessionNames } from '~/src/server/common/constants/session-names'

const resetGitHubAnswer = {
  method: (request, h) => {
    const cdpUser = request.yar.get(sessionNames.cdpUser)
    const githubSearch = request.query?.githubSearch || null

    if (request.isXhr()) {
      // If githubSearch is empty and session holds a value for github. Remove github from session
      if (!githubSearch && !isUndefined(cdpUser?.github)) {
        request.yar.set(sessionNames.cdpUser, omit(cdpUser, ['github']))
      }
    }
    return h.continue
  }
}

export { resetGitHubAnswer }
