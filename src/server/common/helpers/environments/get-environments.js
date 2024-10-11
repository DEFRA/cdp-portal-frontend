import { environments } from '~/src/config'

function getEnvironments(isAdmin = false) {
  if (isAdmin) {
    return {
      infraDev: environments.infraDev,
      management: environments.management,
      dev: environments.dev,
      test: environments.test,
      perfTest: environments.perfTest,
      extTest: environments.extTest,
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
