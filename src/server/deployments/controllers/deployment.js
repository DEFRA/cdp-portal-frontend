import Joi from 'joi'
import Boom from '@hapi/boom'

import { formatText } from '../../../config/nunjucks/filters/filters.js'
import { pagination } from '../../common/constants/pagination.js'
import { deploymentStatus } from '../../common/constants/deployment.js'
import { provideDeployment } from '../helpers/pre/provide-deployment.js'
import { getAllEnvironmentKebabNames } from '../../common/helpers/environments/get-environments.js'
import { transformSecrets } from '../../common/components/secrets-list/helpers/transform-secrets.js'
import { provideEcsDeploymentStatus } from '../helpers/provide-ecs-deployment-status.js'
import { allEnvironmentsOnlyForAdmin } from '../../common/helpers/ext/all-environments-only-for-admin.js'
import { deploymentFaviconState } from '../helpers/deployment-favicon-state.js'
import {
  transformDeploymentToStatusSummary,
  transformDeploymentToSummary
} from '../transformers/deployment-to-summary.js'

const deploymentController = {
  options: {
    id: 'deployments/{environment}/{deploymentId}',
    ext: {
      onPostAuth: [allEnvironmentsOnlyForAdmin]
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
    const environment = deployment?.environment
    const formattedEnvironment = formatText(environment)
    const secretDetail = transformSecrets(deployment?.secrets)
    const ecsDeployment = provideEcsDeploymentStatus(deployment)
    const shouldPoll =
      (deployment?.status && deployment.status !== deploymentStatus.running) ||
      (deployment?.status && deployment.status !== deploymentStatus.undeployed)

    return h.view('deployments/views/deployment', {
      faviconState: deploymentFaviconState(deployment?.status),
      pageTitle: `${deployment?.service} ${deployment?.version} deployment - ${formattedEnvironment}`,
      pageHeading: {
        caption: 'Microservice deployment',
        text: deployment?.service,
        intro: `Microservice deployment for <strong>${deployment?.service}</strong>, version <strong>${deployment?.version}</strong> in <strong>${deployment?.environment}</strong>`
      },
      deployment,
      shouldPoll,
      statusSummaryList: transformDeploymentToStatusSummary(
        deployment,
        ecsDeployment
      ),
      deploymentSummaryList: transformDeploymentToSummary(deployment),
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
          text: `${deployment?.service} - ${deployment?.version}`
        }
      ]
    })
  }
}

export { deploymentController }
