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
  const environment = request.params.environment

  const topology = [
    {
      name: 'trade-imports-gmr-finder',
      type: 'Backend',
      teams: [
        {
          teamId: 'trade-goods-movements',
          name: 'Trade-Goods-Movements'
        }
      ],
      resources: [
        {
          name: 'trade_imports_matched_gmrs',
          icon: 'aws-sns',
          links: []
        },
        {
          name: 'trade_imports_data_upserted_gmr_finder',
          icon: 'aws-sqs',
          links: [
            {
              service: 'trade-imports-data-api',
              resource: 'trade_imports_data_upserted',
              type: 'subscription'
            }
          ]
        }
      ]
    },
    {
      name: 'trade-imports-processor',
      type: 'Backend',
      teams: [
        {
          teamId: 'trade-data-matching',
          name: 'Trade-Data-Matching'
        }
      ],
      resources: [
        {
          name: 'trade-imports-processor',
          icon: 'aws-sqs',
          links: [
            {
              service: 'trade-imports-gmr-finder',
              resource: 'trade_imports_matched_gmrs',
              type: 'subscription'
            }
          ]
        }
      ]
    },
    {
      name: 'trade-imports-gmr-processor',
      type: 'Backend',
      teams: [
        {
          teamId: 'trade-goods-movements',
          name: 'Trade-Goods-Movements'
        }
      ],
      resources: [
        {
          name: 'trade-imports-gmr-processor',
          icon: 'aws-sqs',
          links: [
            {
              service: 'trade-imports-gmr-finder',
              resource: 'trade_imports_matched_gmrs',
              type: 'subscription'
            }
          ]
        }
      ]
    },
    {
      name: 'trade-imports-data-api',
      type: 'Backend',
      teams: [
        {
          teamId: 'trade-data-matching',
          name: 'Trade-Data-Matching'
        }
      ],
      resources: [
        {
          name: 'trade_imports_data_upserted',
          icon: 'aws-sns',
          links: []
        }
      ]
    }
  ]

  const servicesPerTeam = Object.groupBy(topology, ({ teams }) =>
    teams.map(({ teamId }) => teamId).join('_')
  )

  return {
    servicesPerTeam,
    environment
  }
}
