import { scopes } from '~/src/server/common/constants/scopes'
import { addServiceOwnerScope } from '~/src/server/services/helpers/add-service-owner-scope'
import { provideService } from '~/src/server/services/helpers/pre/provide-service'

const secretsController = {
  options: {
    id: 'services/{serviceId}/secrets',
    pre: [provideService],
    ext: {
      onCredentials: addServiceOwnerScope()
    },
    auth: {
      mode: 'required',
      access: {
        scope: [scopes.admin, scopes.serviceOwner]
      }
    }
  },
  handler: async (request, h) => {
    const service = request.pre.service

    return h.view('services/views/secrets', {
      pageTitle: `${service.serviceName} - Secrets`,
      heading: service.serviceName,
      service,
      breadcrumbs: [
        {
          text: 'Services',
          href: '/services'
        },
        {
          text: service.serviceName,
          href: `/services/${service.serviceName}`
        },
        {
          text: 'Secrets'
        }
      ]
    })
  }
}

export { secretsController }
