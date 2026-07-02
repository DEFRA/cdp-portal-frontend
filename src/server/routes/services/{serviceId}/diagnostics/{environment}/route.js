import {
  commonServiceExtensions,
  provideNotFoundIfPrototypeExtension
} from '#server/common/helpers/ext/extensions.js'
import { SERVICE } from '#server/common/patterns/entities/tabs/constants.js'
import { provideSubNav } from '#server/helpers/provide-sub-navigation.js'
import { serviceParamsValidation } from '#server/services/helpers/schema/service-params-validation.js'
import { scopes } from '@defra/cdp-validation-kit'
import { Boom } from '@hapi/boom'
import { formatText } from '#config/nunjucks/filters/filters.js'
import { fetchRunningServices } from '#server/common/helpers/fetch/fetch-running-services.js'
import transformResources from '../utils/transformResources.js'
import createDashboardRows from '../utils/createDashboardRows.js'
import createAlertRows from '../utils/createAlertRows.js'
import { getPlayground } from '../PlaygroundService.js'

export const ext = [
  ...commonServiceExtensions,
  provideNotFoundIfPrototypeExtension,
  {
    type: 'onPostHandler',
    method: provideSubNav('diagnostics', SERVICE, { withoutAll: true }),
    options: {
      sandbox: 'plugin'
    }
  }
]

export const options = {
  id: 'services/{serviceId}/diagnostics/{environment}',
  validate: {
    params: serviceParamsValidation,
    failAction: () => Boom.boomify(Boom.notFound())
  },
  auth: {
    mode: 'required',
    access: {
      scope: [scopes.tenant, scopes.admin]
    }
  }
}

export default async function (request) {
  const { entity } = request.app
  const environment = request.params.environment

  const [runningServices, playground] = await Promise.all([
    fetchRunningServices(entity.name),
    getPlayground(entity.name)
  ])

  const serviceDeployedInEnvironment = runningServices.some(
    (service) => service.environment === environment
  )

  const resources = transformResources(entity.environments[environment])

  function logViewUrl(type) {
    return `https://logs.${environment}.cdp-int.defra.cloud/_dashboards/app/discover#/view/${entity.name}-${type}`
  }

  return {
    environment,
    serviceDeployedInEnvironment,
    resources,
    playground,
    renderLinks,
    logViewUrl,
    apigwMetricLink,
    createDashboardRows,
    createAlertRows,
    userIsAdmin: request.userIsAdmin(),
    userIsOwner: request.userIsOwner(entity),
    breadcrumbs: [
      {
        text: 'Services',
        href: '/services'
      },
      {
        text: entity.name,
        href: `/services/${entity.name}`
      },
      {
        text: 'Diagnostics'
      },
      {
        text: formatText(environment)
      }
    ]
  }
}

function renderLinks(label, logsUrl, metricsUrl) {
  const logsLink =
    logsUrl && `<a href='${logsUrl}' data-js='open-window'>Logs</a>`
  const metricsLink =
    metricsUrl && `<a href='${metricsUrl}' data-js='open-window'>Metrics</a>`
  const labelEl = `<span class="mermaid--label">${label}</span>`

  return `${labelEl}${[logsLink, metricsLink].filter(Boolean).join(' | ')}`
}

function apigwMetricLink(metrics = [], type) {
  return metrics.find(({ scope }) => scope === type)?.url
}
