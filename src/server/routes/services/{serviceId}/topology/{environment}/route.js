import {
  commonServiceExtensions,
  provideNotFoundIfPrototypeExtension
} from '#server/common/helpers/ext/extensions.js'
import { SERVICE } from '#server/common/patterns/entities/tabs/constants.js'
import { provideSubNav } from '#server/helpers/provide-sub-navigation.js'
import { serviceParamsValidation } from '#server/services/helpers/schema/service-params-validation.js'
import { scopes } from '@defra/cdp-validation-kit'
import { Boom } from '@hapi/boom'

export const ext = [
  ...commonServiceExtensions,
  provideNotFoundIfPrototypeExtension,
  {
    type: 'onPostHandler',
    method: provideSubNav('topology', SERVICE, { withoutAll: true }),
    options: {
      sandbox: 'plugin'
    }
  }
]

export const options = {
  id: 'services/{serviceId}/topology/{environment}',
  validate: {
    params: serviceParamsValidation,
    failAction: () => Boom.boomify(Boom.notFound())
  },
  auth: {
    mode: 'required',
    access: {
      scope: [/* scopes.tenant, */ scopes.admin] // TODO: Enable for tenants
    }
  }
}

export default async function (request) {
  const topology = [
    {
      name: 'cdp-portal-backend',
      type: 'backend',
      teams: ['platform'],
      resources: [
        {
          name: 'error_messages.fifo',
          icon: 'aws-sns'
        },
        {
          name: 'message_queue',
          icon: 'aws-sqs',
          links: [
            {
              target: {
                service: 'cdp-portal-backend',
                resource: 'error_messages.fifo'
              },
              type: 'subscription'
            }
          ]
        },
        {
          name: 'portal-bucket',
          icon: 'aws-s3',
          links: [
            {
              target: {
                service: 'cdp-portal-frontend'
              },
              type: 'read'
            },
            {
              target: {
                service: 'exp-demo-frontend'
              },
              type: 'read/write'
            }
          ]
        }
      ]
    },
    {
      name: 'cdp-portal-frontend',
      type: 'frontend',
      teams: ['platform'],
      resources: [
        {
          name: 'error_message_queue',
          icon: 'aws-sqs',
          links: [
            {
              target: {
                service: 'cdp-portal-backend',
                resource: 'error_messages.fifo'
              },
              type: 'subscription'
            }
          ]
        }
      ]
    },
    {
      name: 'exp-demo-frontend',
      type: 'frontend',
      teams: ['demo', 'demo2'],
      resources: [
        {
          name: 'error_queue',
          icon: 'aws-sqs',
          links: [
            {
              target: {
                service: 'cdp-portal-backend',
                resource: 'error_messages.fifo'
              },
              type: 'subscription'
            }
          ]
        }
      ]
    }
  ]

  const servicesPerTeam = Object.groupBy(topology, ({ teams }) =>
    teams.join('_')
  )

  console.log(servicesPerTeam)

  return {
    servicesPerTeam
  }
}
