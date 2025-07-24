import Joi from 'joi'
import Boom from '@hapi/boom'

import { formatText } from '../../../../../config/nunjucks/filters/filters.js'
import { buildOptions } from '../../../../common/helpers/options/build-options.js'
import { getAutoDeployDetails } from '../helpers/fetchers.js'
import { getEnvironments } from '../../../../common/helpers/environments/get-environments.js'
import { provideAuthedUser } from '../../../../common/helpers/auth/pre/provide-authed-user.js'

const autoDeploymentsController = {
  options: {
    id: 'services/{serviceId}/automations/deployments',
    pre: [provideAuthedUser],
    validate: {
      params: Joi.object({
        serviceId: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const authedUser = request.pre.authedUser
    const serviceId = request.params.serviceId
    const entity = request.app.entity

    if (entity == null) {
      return Boom.notFound()
    }

    const autoDeployDetails = await getAutoDeployDetails(serviceId)
    const environments = getEnvironments(authedUser?.scope).filter(
      (environment) => environment.toLowerCase() !== 'prod'
    )
    const environmentOptions = buildOptions(
      environments.map((environment) => ({
        text: formatText(environment),
        value: environment
      })),
      false
    )

    return h.view('services/service/automations/views/auto-deployments', {
      pageTitle: `Deployments | Automations - ${serviceId}`,
      formValues: {
        environments: autoDeployDetails?.environments ?? []
      },
      entity,
      environmentOptions,
      breadcrumbs: [
        {
          text: 'Services',
          href: '/services'
        },
        {
          text: serviceId,
          href: `/services/${serviceId}`
        },
        {
          text: 'Automations',
          href: `/services/${serviceId}/automations`
        },
        {
          text: 'Deployments'
        }
      ]
    })
  }
}

export { autoDeploymentsController }
