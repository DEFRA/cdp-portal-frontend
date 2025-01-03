import Joi from 'joi'
import Boom from '@hapi/boom'

const summaryController = {
  options: {
    validate: {
      query: Joi.object({
        serviceName: Joi.string()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: (request, h) => {
    const decommissionedServiceName = request.query.serviceName ?? 'Service'

    return h.view('admin/decommission-service/views/summary', {
      pageTitle: 'Service Decommissioned - ' + decommissionedServiceName,
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
          text: 'Summary'
        }
      ]
    })
  }
}

export { summaryController }
