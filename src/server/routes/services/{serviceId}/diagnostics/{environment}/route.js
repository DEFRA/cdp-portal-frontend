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

  const resources = Object.fromEntries(
    Object.entries(entity.environments[environment]).map(([key, value]) => {
      if (key === 'metrics') {
        return [key, { ...Object.groupBy(value, (item) => item.type) }]
      }

      return [key, value]
    })
  )

  const bucket = config.get('documentation.bucket')
  const summaries = Object.fromEntries(
    await Promise.all([
      fetchFirstParagraph(request, bucket, 'how-to/proxy.md'),
      fetchFirstParagraph(request, bucket, 'how-to/proxy.md')
    ])
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
  const md = await fetchMarkdown(request, bucket, path)
  const { html } = await buildDocsPageHtml(md)

  return [path, html.match(/<p>([\s\S]*?)<\/p>/).at(0)]
}
