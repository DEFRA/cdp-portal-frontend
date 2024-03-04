import { environments } from '~/src/config'

async function getEnvironments(request) {
  const authedUser = await request.getUserSession()
  const isAdmin = authedUser.isAdmin

  if (isAdmin) {
    return {
      infraDev: environments.infraDev,
      management: environments.management,
      dev: environments.dev,
      test: environments.test,
      perfTest: environments.perfTest,
      prod: environments.prod
    }
  }
  return {
    dev: environments.dev,
    test: environments.test,
    perfTest: environments.perfTest,
    prod: environments.prod
  }
}

export { getEnvironments }
