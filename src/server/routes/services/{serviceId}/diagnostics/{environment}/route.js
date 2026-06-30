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

  entity.environments[environment].metrics = [
    {
      url: 'https://metrics.prod.cdp-int.defra.cloud/d/aejsmnvloxam8f/btms-gateway-service',
      type: 'service',
      uid: 'aejsmnvloxam8f',
      scope: '',
      version: 6
    },
    {
      url: 'https://metrics.prod.cdp-int.defra.cloud/d/2e781706-1169-4e32-8bd2-b4e8629785d3/btms-gateway-mongodb',
      type: 'mongodb',
      uid: '2e781706-1169-4e32-8bd2-b4e8629785d3',
      scope: '',
      version: 1
    },
    {
      url: 'https://metrics.prod.cdp-int.defra.cloud/d/af1398ea-1784-4a46-a704-4984620f3ba1/btms-gateway-api-gateway-private',
      type: 'apigw',
      uid: 'af1398ea-1784-4a46-a704-4984620f3ba1',
      scope: 'private',
      version: 1
    },
    {
      url: 'https://metrics.prod.cdp-int.defra.cloud/d/btms-gateway-all-3da12fe2/btms-gateway-all',
      type: 'custom',
      uid: 'btms-gateway-all-3da12fe2',
      scope: '',
      version: 1
    },
    {
      url: 'https://metrics.prod.cdp-int.defra.cloud/d/btms-gateway-custom-afd52a41/btms-gateway-custom',
      type: 'custom',
      uid: 'btms-gateway-custom-afd52a41',
      scope: '',
      version: 1
    }
  ]
  entity.environments[environment].alerts = [
    {
      name: 'btms-gateway-ecs-desired-running-tasks',
      type: 'default',
      uid: 'fenpzff50b7r4b',
      annotations: {
        description: '',
        runbook_url:
          'https://eaflood.atlassian.net/wiki/spaces/ALVS/pages/5735743637/BTMS+Gateway+Support+Runbook',
        summary:
          'Number of desired ECS tasks is  greater than number of ECS running tasks!!'
      }
    },
    {
      name: 'btms-gateway-cpu-utilization',
      type: 'default',
      uid: 'benpzff52t43kc',
      annotations: {
        description: '',
        runbook_url:
          'https://eaflood.atlassian.net/wiki/spaces/ALVS/pages/5735743637/BTMS+Gateway+Support+Runbook',
        summary: 'CPU utilization is above 80%'
      }
    },
    {
      name: 'btms-gateway-mem-utilization',
      type: 'default',
      uid: 'fenpzff57swsge',
      annotations: {
        description: '',
        runbook_url:
          'https://eaflood.atlassian.net/wiki/spaces/ALVS/pages/5735743637/BTMS+Gateway+Support+Runbook',
        summary: 'MEM utilization is above 80%'
      }
    },
    {
      name: 'btms-gateway-storage-utilization',
      type: 'default',
      uid: 'fenpzff5csphcd',
      annotations: {
        description: '',
        runbook_url:
          'https://eaflood.atlassian.net/wiki/spaces/ALVS/pages/5735743637/BTMS+Gateway+Support+Runbook',
        summary: 'Ephemeral storage utilization is above 80%'
      }
    },
    {
      name: 'btms-gateway - Average Response Time',
      type: 'default',
      uid: 'denpzff8w5j40e',
      annotations: {
        description: 'Average Response Time Alert',
        runbook_url:
          'https://eaflood.atlassian.net/wiki/spaces/ALVS/pages/5735743637/BTMS+Gateway+Support+Runbook',
        summary:
          'Average Response Time Alert in milliseconds of the http.response.response_time value in Opensearch.'
      }
    },
    {
      name: 'btms-gateway - HTTP Status Code',
      type: 'default',
      uid: 'ff5di4j076pz4f',
      annotations: {
        description: 'HTTP Status code alert',
        runbook_url:
          'https://eaflood.atlassian.net/wiki/spaces/ALVS/pages/5735743637/BTMS+Gateway+Support+Runbook',
        summary:
          'HTTP status codes alerts based on http.response.status_code in OpenSearch'
      }
    },
    {
      name: 'btms-gateway - Log Ingestion Errors',
      type: 'default',
      uid: 'bfbiwwdu52arkd',
      annotations: {
        description: 'Log Ingestion Errors',
        runbook_url:
          'https://eaflood.atlassian.net/wiki/spaces/ALVS/pages/5735743637/BTMS+Gateway+Support+Runbook',
        summary:
          'One or more application logs from btms-gateway failed OpenSearch ingestion, possibly due to a field type mismatch.'
      }
    },
    {
      name: 'btms-gateway-gateway-sqs-dlq',
      type: 'custom',
      uid: 'd41ccd40ae45ad38047f22b1e9f2d050af165554',
      annotations: {
        description: 'Gateway SQS DLQ',
        runbook_url: '',
        summary: 'Gateway SQS DLQ'
      }
    },
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
  ]

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

function renderLinks(label, logsUrl, metricsUrl, docPath) {
  const logsLink =
    logsUrl && `<a href='${logsUrl}' data-js='open-window'>Logs</a>`
  const metricsLink =
    metricsUrl && `<a href='${metricsUrl}' data-js='open-window'>Metrics</a>`
  const labelEl = docPath
    ? `<button popovertarget="${label}" class="mermaid--label mermaid--popover-anchor">${label}</button><dialog id="${label}" class="mermaid--popover" popover><header>${label}</header><section><p>${summaries[docPath]}</p><p class="read-more"><a href="/documentation/${docPath}" data-js="open-window">Read the full documentation</p></p></section></dialog>`
    : `<span class="mermaid--label">${label}</span>`

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
