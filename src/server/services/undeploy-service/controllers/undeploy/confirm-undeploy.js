import Boom from '@hapi/boom'

import { fetchCdpUser } from '~/src/server/admin/users/helpers/fetch/index.js'
import { serviceParamsValidation } from '~/src/server/services/helpers/schema/service-params-validation.js'

function undeploymentSummary(serviceName, environment) {
  return {
    classes: 'app-summary-list',
    attributes: {
      'data-testid': 'govuk-summary-list'
    },
    rows: [
      {
        key: { text: 'Image name' },
        value: { text: serviceName }
      },
      {
        key: { text: 'Environment' },
        value: { text: environment }
      }
    ]
  }
}

const confirmUndeployServiceController = {
  options: {
    id: 'services/{serviceId}/undeploy-service/{environment}',
    validate: {
      params: serviceParamsValidation,
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: (request, h) => {
    // const { user } = await fetchCdpUser(request.params?.userId)
    const serviceName = request.params.serviceId
    const environment = request.params.environment

    return h.view('undeploy-service/confirm-undeploy', {
      pageTitle: 'Confirm Undeploy Service',
      summaryList: undeploymentSummary(serviceName, environment),
      breadcrumbs: [
        {
          text: 'Services',
          href: '/services'
        },
        {
          text: serviceName,
          href: `/services/${serviceName}`
        },
        {
          text: 'Undeploy service'
        }
      ]
    })
  }
}

export { confirmUndeployServiceController }
