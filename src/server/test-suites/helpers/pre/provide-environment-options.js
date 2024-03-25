import { without } from 'lodash'

import { environments } from '~/src/config'
import { buildOptions } from '~/src/server/common/helpers/options/build-options'
import { sortByEnv } from '~/src/server/common/helpers/sort/sort-by-env'

const provideEnvironmentOptions = {
  method: async function (request) {
    const authedUser = await request.getUserSession()

    if (authedUser && authedUser.isAuthenticated) {
      const { isAdmin } = authedUser
      const sortedEnvs = Object.values(environments).toSorted(sortByEnv)

      if (isAdmin) {
        return buildOptions(sortedEnvs)
      }

      const userOwnsTestSuite = await request.userIsMemberOfATeam(
        request.pre.testSuite.teams.map((testsuite) => testsuite.teamId)
      )

      if (userOwnsTestSuite) {
        return buildOptions(without(sortedEnvs, 'management', 'infra-dev'))
      }
    }

    return []
  },
  assign: 'environmentOptions'
}

export { provideEnvironmentOptions }
