import Joi from 'joi'
import Boom from '@hapi/boom'

import { buildLink } from '~/src/server/common/helpers/view/build-link.js'
import { provideVanityUrls } from '~/src/server/services/service/about/transformers/vanity-urls.js'
import { formatText } from '~/src/config/nunjucks/filters/filters.js'

const shutteringController = {
  options: {
    id: 'services/{serviceId}/shuttering',
    validate: {
      params: Joi.object({
        serviceId: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const serviceId = request.params.serviceId
    const entity = request.app.entity

    if (entity === null) {
      return Boom.notFound()
    }

    const vanityUrls = await provideVanityUrls(request)
    const serviceUrls = vanityUrls.flatMap(({ urls }) => urls)

    return h.view('services/service/shuttering/views/shuttering', {
      pageTitle: `Shuttering - ${serviceId}`,
      entity,
      serviceUrls,
      serviceUrlsOptions: serviceUrls.map(({ environment, url }) => ({
        value: url,
        html: `<strong>${formatText(environment)}</strong> <br /> ${buildLink({ href: `https://${url}` })}`,
        label: { classes: 'app-!-margin-top-negative-1' }
      })),
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
          text: 'Shuttering'
        }
      ]
    })
  }
}

export { shutteringController }
