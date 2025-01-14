import Joi from 'joi'
import Boom from '@hapi/boom'

import { provideService } from '~/src/server/services/helpers/pre/provide-service.js'
import { fetchAllBuckets } from '~/src/server/services/helpers/fetch/fetch-all-buckets.js'
import { adminOwnedService } from '~/src/server/common/helpers/user/admin-owned-service.js'
import { allEnvironmentBuckets } from '~/src/server/services/buckets/transformers/all-environment-buckets.js'
import { getEnvironments } from '~/src/server/common/helpers/environments/get-environments.js'

const allBucketsController = {
  options: {
    id: 'services/{serviceId}/buckets',
    pre: [provideService],
    validate: {
      params: Joi.object({
        serviceId: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const service = request.pre.service
    const serviceName = service.serviceName
    const environments = getEnvironments(request.auth.credentials?.scope)
    const allBuckets = await fetchAllBuckets(serviceName)
    const bucketsByEnvironment = allEnvironmentBuckets(environments, allBuckets)

    const serviceTeamIds = service.teams?.map((team) => team.teamId)
    const isAdminOwnedService = adminOwnedService(serviceTeamIds)

    return h.view('services/buckets/views/all', {
      pageTitle: `${serviceName} - Buckets`,
      service,
      bucketsByEnvironment,
      isAdminOwnedService,
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
          text: 'Buckets'
        }
      ]
    })
  }
}

export { allBucketsController }
