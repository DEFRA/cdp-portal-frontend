import Joi from 'joi'
import Boom from '@hapi/boom'
import { kebabCase, upperFirst } from 'lodash'

import { config, environments } from '~/src/config'
import { scopes } from '~/src/server/common/constants/scopes'
import { provideService } from '~/src/server/services/helpers/pre/provide-service'
import { addServiceOwnerScope } from '~/src/server/services/helpers/add-service-owner-scope'
import { getEnvironmentsByTeam } from '~/src/server/common/helpers/environments/get-environments-by-team'

const platformGlobalSecretKeys = config.get('platformGlobalSecretKeys')

const updateSecretFormController = {
  options: {
    id: 'services/{serviceId}/secrets/{environment}/update',
    ext: {
      onCredentials: addServiceOwnerScope()
    },
    auth: {
      mode: 'required',
      access: {
        scope: [scopes.admin, scopes.serviceOwner]
      }
    },
    pre: [provideService],
    validate: {
      params: Joi.object({
        serviceId: Joi.string().required(),
        environment: Joi.string()
          .valid(...Object.values(environments))
          .required()
      }),
      query: Joi.object({
        secretKey: Joi.string()
          .not(...platformGlobalSecretKeys)
          .min(1)
          .max(256)
          .required()
      }),
      failAction: () => Boom.boomify(Boom.badRequest())
    }
  },
  handler: async (request, h) => {
    const service = request.pre.service
    const team = service?.teams?.at(0)
    const teamId = team?.teamId
    const serviceName = service.serviceName
    const environment = request.params?.environment
    const secretKey = request.query?.secretKey
    const allowedEnvironments = getEnvironmentsByTeam(service?.teams)
    const formattedEnvironment = upperFirst(kebabCase(environment))

    return h.view('services/views/secrets/update-form', {
      pageTitle: `${serviceName} - Update secret`,
      heading: serviceName,
      service,
      teamId,
      environment,
      secretKey,
      allowedEnvironments,
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
          text: 'Secrets',
          href: `/services/${serviceName}/secrets`
        },
        {
          text: formattedEnvironment,
          href: `/services/${serviceName}/secrets/${environment}`
        },
        {
          text: `Update secret`
        }
      ]
    })
  }
}

export { updateSecretFormController }
