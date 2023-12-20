import Joi from 'joi'
import Boom from '@hapi/boom'

import { environments } from '~/src/config'
import { fetchDeployment } from '~/src/server/deployments/helpers/fetch-deployment'
import { transformDeploymentToEntityDataList } from '~/src/server/deployments/transformers/transform-deployment-to-entity-data-list'
import { deploymentTabs } from '~/src/server/deployments/helpers/deployment-tabs'
import { transformDeployment } from '~/src/server/deployments/transformers/transform-deployment'
import { getDeploymentStatusClassname } from '~/src/server/deployments/helpers/get-deployment-status-classname'

const deploymentController = {
  options: {
    validate: {
      params: Joi.object({
        environment: Joi.string().valid(...Object.values(environments)),
        deploymentId: Joi.string()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const deploymentDetail = transformDeployment(
      await fetchDeployment(request.params?.deploymentId)
    )

    return h.view('deployments/views/deployment', {
      pageTitle: `${deploymentDetail.service} Service Deployment`,
      heading: 'Deployment',
      caption: 'Microservice deployment detail.',
      statusClasses: getDeploymentStatusClassname(
        deploymentDetail.status.overall
      ),
      entityDataList: transformDeploymentToEntityDataList(deploymentDetail),
      tabs: deploymentTabs(request),
      deploymentDetail
    })
  }
}

export { deploymentController }
