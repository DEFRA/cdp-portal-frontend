import Joi from 'joi'
import Boom from '@hapi/boom'

import { fetchCost } from '~/src/server/admin/costs/helpers/fetchers.js'
import { amazonWebServicesData } from '~/src/server/admin/costs/helpers/amazon-web-services-data.js'

const costController = {
  options: {
    validate: {
      query: Joi.object({
        // TODO add sorting
        from: Joi.string().allow(''),
        to: Joi.string().allow('')
      }),
      params: Joi.object({
        serviceCode: Joi.string().required() // TODO add in valid serviceCodes
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const response = await fetchCost('cdp')

    const dataAmazonWebServices = amazonWebServicesData(response)

    return h.view('admin/costs/views/cost', {
      pageTitle: 'Cost',
      serviceCode: request.params.serviceCode.toUpperCase(),
      amazonWebServicesChartData: {
        id: 'amazon-web-services',
        testId: 'amazon-web-services',
        data: dataAmazonWebServices
      },
      breadcrumbs: [
        {
          text: 'Admin',
          href: '/admin'
        },
        {
          text: 'Costs',
          href: '/admin/costs'
        },
        {
          text: 'CDP'
        }
      ]
    })
  }
}

export { costController }
