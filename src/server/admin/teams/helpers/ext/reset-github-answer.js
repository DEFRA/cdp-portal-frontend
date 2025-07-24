import isUndefined from 'lodash/isUndefined.js'
import omit from 'lodash/omit.js'

import { sessionNames } from '../../../../common/constants/session-names.js'

const resetGithubAnswer = {
  method: (request, h) => {
    const cdpTeam = request.yar.get(sessionNames.cdpTeam)
    const githubSearch = request.query?.githubSearch || null

    if (request.isXhr()) {
      // If githubSearch is empty and session holds a value for github team name. Remove github from session
      if (!githubSearch && !isUndefined(cdpTeam?.github)) {
        request.yar.set(sessionNames.cdpTeam, omit(cdpTeam, ['github']))
      }
    }
    return h.continue
  }
}

export { resetGithubAnswer }
