import Joi from 'joi'
import Boom from '@hapi/boom'
import isNull from 'lodash/isNull.js'
import kebabCase from 'lodash/kebabCase.js'
import upperFirst from 'lodash/upperFirst.js'
import { provideDeployment } from '~/src/server/deployments/helpers/pre/provide-deployment.js'
import { allEnvironmentsOnlyForAdmin } from '~/src/server/deployments/helpers/ext/all-environments-only-for-admin.js'
import { pagination } from '~/src/server/common/constants/pagination.js'
import { provideEcsDeploymentStatus } from '~/src/server/deployments/helpers/provide-ecs-deployment-status.js'
import { transformSecrets } from '~/src/server/common/components/secrets-list/helpers/transform-secrets.js'
import { getAllEnvironmentKebabNames } from '~/src/server/common/helpers/environments/get-environments.js'

const deploymentController = {
  options: {
    ext: {
      onPreAuth: [allEnvironmentsOnlyForAdmin]
    },
    pre: [provideDeployment],
    validate: {
      params: Joi.object({
        environment: Joi.string().valid(...getAllEnvironmentKebabNames()),
        deploymentId: Joi.string()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: (request, h) => {
    const deployment = request.pre.deployment
    const environment = deployment.environment
    const formattedEnvironment = upperFirst(kebabCase(environment))

    // TODO update to use new polling helpers
    if (isNull(deployment)) {
      return null
    }

    const secretDetail = transformSecrets(deployment.secrets)

    return h.view('deployments/views/deployment', {
      pageTitle: `${deployment.service} ${deployment.version} deployment - ${formattedEnvironment}`,
      heading: `${formattedEnvironment} deployment`,
      caption: `Microservice deployment for <strong>${deployment.service}</strong>, version <strong>${deployment.version}</strong>.`,
      deployment,
      secretDetail,
      teams: deployment?.teams?.filter((team) => team.teamId),
      breadcrumbs: [
        {
          text: 'Deployments',
          href: `/deployments?page=${pagination.page}&size=${pagination.size}`
        },
        {
          text: formattedEnvironment,
          href: `/deployments/${environment}?page=${pagination.page}&size=${pagination.size}`
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
