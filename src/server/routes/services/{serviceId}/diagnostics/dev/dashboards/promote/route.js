import { scopes } from '@defra/cdp-validation-kit'
import createDashboardRows from '../../../utils/createDashboardRows.js'
import {
  commonServiceExtensions,
  provideNotFoundIfPrototypeExtension
} from '#server/common/helpers/ext/extensions.js'

export const ext = [
  ...commonServiceExtensions,
  provideNotFoundIfPrototypeExtension
]

export const options = {
  auth: {
    mode: 'required',
    access: {
      scope: [scopes.tenant, scopes.admin]
    }
  }
}

export default async function (request) {
  const { entity } = request.app

  // TODO: Fetch if dev
  const playground = {
    alerts: [
      {
        name: 'btms-gateway-health-status',
        type: 'custom',
        uid: 'e9821b3c84ffdfc70d30319ed096a0343f5aecf0',
        annotations: {
          description: 'BTMS Gateway service health check',
          runbook_url:
            'https://eaflood.atlassian.net/wiki/spaces/ALVS/pages/5735743637/BTMS+Gateway+Support+Runbook',
          summary:
            "BTMS Gateway health check of the application and it's dependencies."
        }
      }
    ],
    dashboards: [
      {
        url: 'https://metrics.prod.cdp-int.defra.cloud/d/btms-gateway-all-3da12fe2/btms-gateway-all',
        type: 'custom',
        uid: 'btms-gateway-all-3da12fe2',
        scope: '',
        version: 1
      }
    ]
  }

  return { entity, dashboardRows: createDashboardRows(playground.dashboards) }
}
