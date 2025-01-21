import Joi from 'joi'
import Boom from '@hapi/boom'

export const decommissionStep2Controller = {
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

    return h.view('admin/decommission-service/views/step-2', {
      pageTitle:
        'Service Decommissioning started - ' + decommissionedServiceName,
      decommissionedServiceName,
      decommissionContinueUrl: `/admin/decommission-service/${decommissionedServiceName}/finish`,
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
          text: 'Step 2'
        }
      ]
    })
  }
}
