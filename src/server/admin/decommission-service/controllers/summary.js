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
    const serviceName = request.query.serviceName

    return h.view('admin/decommission-service/views/summary', {
      pageTitle: 'Service Decommissioned - ' + serviceName,
      heading: 'Service Decommissioned',
      serviceName
    })
  }
}

export { summaryController }
