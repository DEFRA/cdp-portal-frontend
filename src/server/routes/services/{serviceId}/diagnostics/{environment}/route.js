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

  const runningServices = await fetchRunningServices(entity.name)

  const serviceDeployedInEnvironment = runningServices.some(
    (service) => service.environment === environment
  )

  const resources = Object.fromEntries(
    Object.entries(entity.environments[environment] ?? {}).map(
      ([key, value]) => {
        if (key === 'metrics') {
          return [key, { ...Object.groupBy(value, (item) => item.type) }]
        }

        return [key, value]
      }
    )
  )

  function logViewUrl(type) {
    return `https://logs.${environment}.cdp-int.defra.cloud/_dashboards/app/discover#/view/${entity.name}-${type}`
  }

  return {
    environment,
    serviceDeployedInEnvironment,
    resources,
    renderLinks,
    logViewUrl,
    apigwMetricLink,
    createDashboardRows,
    createAlertRows,
    userIsAdmin: request.userIsAdmin(),
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

function createDashboardRows(metrics) {
  const dashboards = Object.entries(metrics)
    .flatMap(([_, dashboard]) => dashboard)
    .map((dashboard) => ({
      // TODO: // replace with title
      ...dashboard,
      name: dashboard.url.split('/').at(-1)
    }))
    .sort((a, b) => a.name.localeCompare(b.name, 'en-GB'))

  return dashboards.map(({ name, type, version, url }) => [
    { text: type },
    {
      html: `<a href="${url}" target="_blank" rel="noopener noreferrer">${name}</a>`
    },
    { text: version }
  ])
}

function createAlertRows(alerts, environment) {
  return alerts
    .sort((a, b) => a.name.localeCompare(b.name, 'en-GB'))
    .map(
      ({
        name,
        type,
        uid,
        // TODO: Missing url
        url = `https://metrics.${environment}.cdp-int.defra.cloud/alerting/grafana/${uid}/view`,
        annotations: { runbook_url } = {}
      }) => [
        { text: type },
        {
          html: `<a href="${url}" target="_blank" rel="noopener noreferrer">${name}</a>`
        },
        {
          html: runbook_url
            ? `<a href="${runbook_url}" target="_blank" rel="noopener noreferrer">Runbook</a>`
            : '- - -'
        }
      ]
    )
}
