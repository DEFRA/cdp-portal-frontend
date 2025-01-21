import Joi from 'joi'
import Boom from '@hapi/boom'

export const decommissionSummaryController = {
  options: {
    validate: {
      params: Joi.object({
        serviceName: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: (request, h) => {
    const decommissionedServiceName = request.params.serviceName

    return h.view('admin/decommission-service/views/summary', {
      pageTitle:
        'Service Decommissioning started - ' + decommissionedServiceName,
      decommissionedServiceName,
      breadcrumbs: [
        {
          text: 'Admin',
          href: '/admin'
        },
        {
          text: 'Decommission',
          href: '/admin/decommission-service'
        },
        {
          text: 'Step 1',
          href: `/admin/decommission-service/${decommissionedServiceName}/step-1`
        },
        {
          text: 'Step 2',
          href: `/admin/decommission-service/${decommissionedServiceName}/step-2`
        },
        {
          text: 'Summary'
        }
      ]
    })
  }
}
