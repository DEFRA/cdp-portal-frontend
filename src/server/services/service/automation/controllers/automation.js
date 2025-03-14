import Joi from 'joi'
import Boom from '@hapi/boom'

import { formatText } from '~/src/config/nunjucks/filters/filters.js'
import { sortByEnv } from '~/src/server/common/helpers/sort/sort-by-env.js'
import { buildOptions } from '~/src/server/common/helpers/options/build-options.js'
import { preProvideService } from '~/src/server/services/helpers/pre/pre-provide-service.js'
import { getAutoDeployDetails } from '~/src/server/services/service/automation/helpers/fetchers.js'
import { fetchRunningServicesById } from '~/src/server/common/helpers/fetch/fetch-running-services-by-id.js'
import { transformServiceToSummary } from '~/src/server/services/service/about/transformers/service-to-summary.js'

const automationController = {
  options: {
    id: 'services/{serviceId}/automation',
    pre: [preProvideService],
    validate: {
      params: Joi.object({
        serviceId: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const serviceId = request.params.serviceId
    const service = request.pre.service

    if (service === null) {
      return Boom.notFound()
    }

    const autoDeployDetails = await getAutoDeployDetails(serviceId)
    const runningServices = await fetchRunningServicesById(serviceId)
    const environmentsWithADeployment = [
      ...new Set(runningServices.map((rs) => rs.environment))
    ].sort(sortByEnv)
    const autoDeployEnvironmentOptions = buildOptions(
      environmentsWithADeployment
        .filter((t) => t !== 'prod')
        .map((t) => ({ text: formatText(t), value: t })),
      false
    )

    return h.view('services/service/automation/views/automation', {
      pageTitle: `${serviceId} - Automation`,
      summaryList: transformServiceToSummary(service),
      formValues: {
        environments: autoDeployDetails?.environments ?? []
      },
      service,
      autoDeployEnvironmentOptions,
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
          text: 'Automation'
        }
      ]
    })
  }
}

export { automationController }
