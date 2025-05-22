import Joi from 'joi'
import Boom from '@hapi/boom'

import { buildLink } from '~/src/server/common/helpers/view/build-link.js'
import { provideVanityUrls } from '~/src/server/services/service/about/transformers/vanity-urls.js'
import { formatText } from '~/src/config/nunjucks/filters/filters.js'
import { vanityUrlToSummary } from '~/src/server/services/service/shuttering/helpers/transformers/vanity-url-to-summary.js'

const confirmShutterController = {
  options: {
    id: 'services/{serviceId}/shuttering/confirm',
    validate: {
      params: Joi.object({
        serviceId: Joi.string().required()
      }),
      query: Joi.object({
        vanityUrl: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const serviceId = request.params.serviceId
    const vanityUrl = request.query.vanityUrl
    const entity = request.app.entity

    const vanityUrls = await provideVanityUrls(request)
    const serviceUrls = vanityUrls.flatMap(({ urls }) => urls)
    const serviceUrl = serviceUrls.find(({ url }) => url === vanityUrl)

    if (entity === null || !serviceUrl) {
      return Boom.notFound()
    }

    return h.view('services/service/shuttering/views/confirm-shutter', {
      pageTitle: `Confirm shutter - ${serviceId}`,
      entity,
      summaryList: vanityUrlToSummary(serviceUrl, entity),
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
          text: 'Shuttering',
          href: `/services/${serviceId}/shuttering`
        },
        {
          text: 'Confirm shutter'
        }
      ]
    })
  }
}

export { confirmShutterController }
