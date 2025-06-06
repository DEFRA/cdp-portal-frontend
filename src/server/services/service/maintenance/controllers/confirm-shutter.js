import Joi from 'joi'
import Boom from '@hapi/boom'

import { fetchShutteringUrl } from '~/src/server/services/helpers/fetch/fetch-shuttering-url.js'
import { shutteringDetailToSummary } from '~/src/server/services/service/maintenance/helpers/transformers/shuttering-detail-to-summary.js'
import { shutteringStatus } from '~/src/server/common/constants/shuttering.js'

const confirmShutterController = {
  options: {
    id: 'services/{serviceId}/maintenance/shuttering',
    validate: {
      params: Joi.object({
        serviceId: Joi.string().required()
      }),
      query: Joi.object({
        url: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const authedUser = await request.getUserSession()
    const serviceId = request.params.serviceId
    const url = request.query.url
    const entity = request.app.entity

    const shutteringDetail = await fetchShutteringUrl(url)

    if (entity === null || !shutteringDetail) {
      return Boom.notFound()
    }

    const isShuttered = shutteringDetail.status === shutteringStatus.shuttered

    return h.view('services/service/maintenance/views/confirm-shutter', {
      pageTitle: `Confirm shutter - ${serviceId}`,
      entity,
      shutteringDetail,
      isShuttered,
      summaryList: shutteringDetailToSummary(shutteringDetail, authedUser),
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
          text: 'Maintenance',
          href: `/services/${serviceId}/maintenance`
        },
        {
          text: `Confirm ${isShuttered ? 'Unshutter' : 'Shutter'}`
        }
      ]
    })
  }
}

export { confirmShutterController }
