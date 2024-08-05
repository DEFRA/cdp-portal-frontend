import Joi from 'joi'
import Boom from '@hapi/boom'
import { isNull, kebabCase, upperFirst } from 'lodash'

import { environments } from '~/src/config'
import { provideDeployment } from '~/src/server/deployments/helpers/pre/provide-deployment'
import { allEnvironmentsOnlyForAdmin } from '~/src/server/deployments/helpers/ext/all-environments-only-for-admin'
import { pagination } from '~/src/server/common/constants/pagination'
import { provideEcsDeploymentStatus } from '~/src/server/deployments/helpers/provide-ecs-deployment-status'
import { transformSecrets } from '~/src/server/common/components/secrets-list/helpers/transform-secrets'

const deploymentController = {
  options: {
    ext: {
      onPreAuth: [allEnvironmentsOnlyForAdmin]
    },
    pre: [provideDeployment],
    validate: {
      params: Joi.object({
        environment: Joi.string().valid(...Object.values(environments)),
        deploymentId: Joi.string()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const deployment = request.pre.deployment

    // TODO update to use new polling helpers
    if (isNull(deployment)) {
      return null
    }

    const secretDetail = transformSecrets(deployment.secrets)

    return h.view('deployments/views/deployment', {
      pageTitle: `${deployment.service} Service Deployment`,
      heading: 'Deployment',
      caption: 'Microservice deployment information.',
      deployment,
      secretDetail,
      teams: deployment?.teams,
      breadcrumbs: [
        {
          text: 'Deployments',
          href: `/deployments?page=${pagination.page}&size=${pagination.size}`
        },
        {
          text: upperFirst(kebabCase(deployment.environment)),
          href: `/deployments/${deployment.environment}?page=${pagination.page}&size=${pagination.size}`
        },
        {
          text: `${deployment.service} - ${deployment.version}`
        }
      ],
      ecsDeployment: provideEcsDeploymentStatus(deployment)
    })
  }
}

export { deploymentController }
