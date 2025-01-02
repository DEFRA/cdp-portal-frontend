import { sortBy } from '~/src/server/common/helpers/sort/sort-by.js'
import { provideStatusClassname } from '~/src/server/running-services/helpers/provide-status-classname.js'
import { fetchRunningServices } from '~/src/server/running-services/helpers/fetch/fetch-running-services.js'
import { decorateDeployment } from '~/src/server/running-services/helpers/transformers/decorate-deployment.js'

async function transformRunningServices(
  request,
  environments,
  deployableServices
) {
  const response = /** @type {Array} */ await fetchRunningServices(
    environments,
    {
      service: request.query.service,
      status: request.query.status,
      team: request.query.team,
      user: request.query.user
    }
  )

  const deploymentDecorator = decorateDeployment(deployableServices)

  return Object.entries(
    response?.sort(sortBy('service', 'asc')).reduce((acc, rs) => {
      if (!acc[rs.service]) {
        acc[rs.service] = {}
      }

      acc[rs.service][rs.environment] = {
        statusClassname: provideStatusClassname(rs.status),
        ...deploymentDecorator(rs)
      }

      return acc
    }, {})
  ).map(([serviceName, serviceEnvironments]) => {
    return {
      serviceName,
      environments: serviceEnvironments
    }
  })
}

export { transformRunningServices }
