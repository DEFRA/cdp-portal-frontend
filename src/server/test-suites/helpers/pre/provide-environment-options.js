import { environments } from '~/src/config/index.js'
import { buildOptions } from '~/src/server/common/helpers/options/build-options.js'
import { sortByEnv } from '~/src/server/common/helpers/sort/sort-by-env.js'
import { findEnvironmentsForTestSuite } from '~/src/server/test-suites/helpers/find-environments-for-test-suite.js'

const provideEnvironmentOptions = {
  method: async function (request) {
    const authedUser = await request.getUserSession()

    if (authedUser?.isAuthenticated) {
      const { isAdmin } = authedUser

      const runnableEnvironments = findEnvironmentsForTestSuite(
        request.pre.testSuite
      )

      if (isAdmin) {
        return buildOptions(
          [
            ...runnableEnvironments,
            environments.infraDev.kebabName,
            environments.management.kebabName
          ].sort(sortByEnv)
        )
      }

      const userOwnsTestSuite = await request.userIsMemberOfATeam(
        request.pre.testSuite.teams.map((team) => team.teamId)
      )

      if (userOwnsTestSuite) {
        return buildOptions(runnableEnvironments.sort(sortByEnv))
      }
    }

    return []
  },
  assign: 'environmentOptions'
}

export { provideEnvironmentOptions }
