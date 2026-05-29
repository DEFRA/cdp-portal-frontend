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
import { fetchMarkdown } from '#server/documentation/helpers/s3-file-handler.js'
import { config } from '#config/config.js'
import { buildDocsPageHtml } from '#server/documentation/helpers/markdown/build-page-html.js'
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
      scope: [/* scopes.tenant, */ scopes.admin] // TODO: Enable for tenants
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

  entity.environments[environment] = {
    urls: {
      'waste-movement-external-api.prod.cdp-int.defra.cloud': {
        type: 'internal',
        enabled: false,
        shuttered: false,
        delegated: false,
        ingress_type: 'nginx'
      },
      'waste-tracking.api.defra.gov.uk': {
        type: 'vanity',
        enabled: false,
        shuttered: false,
        delegated: true,
        ingress_type: 'api_gateway'
      }
    },
    ecr_repository: null,
    s3_buckets: [],
    sqs_queues: [],
    sns_topics: [],
    sql_database: null,
    dynamodb: [],
    api_gateway: {
      arn: 'arn:aws:apigateway:eu-west-2::/restapis/fs49ig1ywi/stages/prod',
      name: 'waste-movement-external-api-private',
      type: 'PRIVATE',
      minimum_compression_size: 1024
    },
    api_gateways: [
      {
        arn: 'arn:aws:apigateway:eu-west-2::/restapis/fs49ig1ywi/stages/prod',
        name: 'waste-movement-external-api-private',
        type: 'PRIVATE',
        minimum_compression_size: 1024
      },
      {
        arn: 'arn:aws:apigateway:eu-west-2::/restapis/fa63sootxg/stages/prod',
        name: 'waste-movement-external-api-public',
        type: 'REGIONAL',
        minimum_compression_size: 1024
      }
    ],
    cognito_identity_pool: null,
    bedrock_ai: null,
    tenant_config: {
      zone: 'protected',
      redis: false,
      mongo: true,
      s3_buckets: [],
      sqs_queues: [],
      sns_topics: [],
      dynamodb: [],
      sql_database: false,
      api_gateway: true,
      cognito_identity_pool: false,
      bedrock_ai: false
    },
    logs: {
      name: 'waste-movement-external-api',
      url: 'https://logs.prod.cdp-int.defra.cloud/_dashboards/app/dashboards#/view/waste-movement-external-api'
    },
    metrics: [
      {
        url: 'https://metrics.prod.cdp-int.defra.cloud/d/deluzqobu7xmoa/waste-movement-external-api-service',
        type: 'service',
        uid: 'deluzqobu7xmoa',
        version: 4
      },
      {
        url: 'https://metrics.prod.cdp-int.defra.cloud/d/98683da7-21e2-4cd8-ad17-1c5936976fa6/waste-movement-external-api-mongodb',
        type: 'mongodb',
        uid: '98683da7-21e2-4cd8-ad17-1c5936976fa6',
        version: 1
      },
      {
        url: 'https://metrics.prod.cdp-int.defra.cloud/d/44207014-0966-4085-a451-2757dc8b535c/waste-movement-external-api-api-gateway-public',
        type: 'apigw',
        uid: '44207014-0966-4085-a451-2757dc8b535c',
        version: 1
      },
      {
        url: 'https://metrics.prod.cdp-int.defra.cloud/d/922a3677-df0f-424f-879f-33ca14ce20b8/waste-movement-external-api-business-stakeholders',
        type: 'custom',
        uid: '922a3677-df0f-424f-879f-33ca14ce20b8',
        version: 1
      },
      {
        url: 'https://metrics.prod.cdp-int.defra.cloud/d/96d66e57-bd69-4f61-ae4b-03765dbc80c0/7267208',
        type: 'custom',
        uid: '96d66e57-bd69-4f61-ae4b-03765dbc80c0',
        version: 1
      },
      {
        url: 'https://metrics.prod.cdp-int.defra.cloud/d/a2b5c5c3-9d08-4693-92fc-feb4c04ed366/waste-movement-external-api-custom',
        type: 'custom',
        uid: 'a2b5c5c3-9d08-4693-92fc-feb4c04ed366',
        version: 1
      }
    ],
    alerts: [
      {
        name: 'waste-movement-external-api-ecs-desired-running-tasks',
        type: 'default',
        uid: 'ef2e3h62r0v0gf',
        annotations: {
          description: '',
          runbook_url: '',
          summary:
            'Number of desired ECS tasks is  greater than number of ECS running tasks!!'
        }
      },
      {
        name: 'waste-movement-external-api-cpu-utilization',
        type: 'default',
        uid: 'ff2e3h62w0npcb',
        annotations: {
          description: '',
          runbook_url: '',
          summary: 'CPU utilization is above 80%'
        }
      },
      {
        name: 'waste-movement-external-api-mem-utilization',
        type: 'default',
        uid: 'df2e3h62w0npde',
        annotations: {
          description: '',
          runbook_url: '',
          summary: 'MEM utilization is above 80%'
        }
      },
      {
        name: 'waste-movement-external-api-storage-utilization',
        type: 'default',
        uid: 'bf2e3h62yik1sc',
        annotations: {
          description: '',
          runbook_url: '',
          summary: 'Ephemeral storage utilization is above 80%'
        }
      },
      {
        name: 'waste-movement-external-api - Average Response Time',
        type: 'default',
        uid: 'bf2e3h633icqob',
        annotations: {
          description: 'Average Response Time Alert',
          runbook_url: '',
          summary:
            'Average Response Time Alert in milliseconds of the http.response.response_time value in Opensearch.'
        }
      },
      {
        name: 'waste-movement-external-api - HTTP Status Code',
        type: 'default',
        uid: 'df5di3f1r5pmoa',
        annotations: {
          description: 'HTTP Status code alert',
          runbook_url: '',
          summary:
            'HTTP status codes alerts based on http.response.status_code in OpenSearch'
        }
      },
      {
        name: 'waste-movement-external-api - Log Ingestion Errors',
        type: 'default',
        uid: 'cfbiwwqqc701se',
        annotations: {
          description: 'Log Ingestion Errors',
          runbook_url: '',
          summary:
            'One or more application logs from waste-movement-external-api failed OpenSearch ingestion, possibly due to a field type mismatch.'
        }
      }
    ],
    playground_alerts_url: null,
    default_alerts_url:
      'https://metrics.prod.cdp-int.defra.cloud/alerting/grafana/namespaces/d17f6da6-a157-4104-bf64-c42626aeda4a/groups/waste-movement-external-api/view',
    advanced_alerts_url:
      'https://metrics.prod.cdp-int.defra.cloud/alerting/grafana/namespaces/d17f6da6-a157-4104-bf64-c42626aeda4a/groups/waste-movement-external-api%20advanced/view',
    nginx: {
      servers: {
        'waste-movement-external-api.prod.cdp-int.defra.cloud': {
          name: 'waste-movement-external-api.prod.cdp-int.defra.cloud',
          locations: {
            '/': {
              path: '/',
              params: {
                proxy_set_header: 'X-cdp-request-id $cdp_request_id',
                proxy_pass: 'https://waste-movement-external-api',
                proxy_pass_request_headers: 'on'
              }
            },
            '/problem-with-service.html': {
              path: '/problem-with-service.html',
              params: {
                root: '/assets',
                internal: ''
              }
            },
            '^~ /nginx-error-assets/': {
              path: '^~ /nginx-error-assets/',
              params: {
                root: '/assets'
              }
            },
            '/upload-and-scan': {
              path: '/upload-and-scan',
              params: {
                client_max_body_size: '2304M',
                proxy_set_header: 'Host cdp-uploader.prod.cdp-int.defra.cloud',
                proxy_pass: 'https://upload-for-virus-scanning/upload-and-scan',
                proxy_pass_request_headers: 'on'
              }
            }
          },
          settings: {
            listen: '443 ssl',
            server_tokens: 'off',
            server_name: 'waste-movement-external-api.prod.cdp-int.defra.cloud',
            ssl_certificate: '/etc/nginx/ssl/cdp.crt',
            ssl_certificate_key: '/etc/nginx/ssl/cdp.key',
            ssl_protocols: 'TLSv1.2 TLSv1.3',
            keepalive_timeout: '0',
            if: '$http_x_forwarded_for ~ 10\\.211\\.8\\.232',
            add_header: 'X-cdp-request-id $cdp_request_id',
            error_page: '502 /problem-with-service.html'
          }
        }
      }
    },
    squid: {
      ports: [80, 443],
      domains: [
        '.amazonaws.com',
        'login.microsoftonline.com',
        'www.gov.uk',
        '.auth.eu-west-2.amazoncognito.com',
        'api.notifications.service.gov.uk',
        'your-account.defra.gov.uk',
        'dcidm.b2clogin.com'
      ]
    }
  }

  const resources = Object.fromEntries(
    Object.entries(entity.environments[environment]).map(([key, value]) => {
      if (key === 'metrics') {
        return [key, { ...Object.groupBy(value, (item) => item.type) }]
      }

      return [key, value]
    })
  )
  console.log(resources.api_gateways)
  const bucket = config.get('documentation.bucket')
  const summaries = Object.fromEntries(
    await Promise.all([fetchFirstParagraph(request, bucket, 'how-to/proxy.md')])
  )

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

  function logViewUrl(type) {
    return `https://logs.${environment}.cdp-int.defra.cloud/_dashboards/app/discover#/view/${entity.name}-${type}`
  }

  return {
    environment,
    serviceDeployedInEnvironment,
    resources,
    renderLinks,
    logViewUrl,
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

async function fetchFirstParagraph(request, bucket, path) {
  const md = await fetchMarkdown(request, bucket, path).catch(
    () => 'Summary not found'
  )
  const { html } = await buildDocsPageHtml(md)

  return [path, html.match(/<p>([\s\S]*?)<\/p>/)?.at(0) ?? '']
}
