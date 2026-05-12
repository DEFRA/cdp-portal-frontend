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

  function renderLinks(label, logsUrl, metricsUrl, description) {
    const logsLink =
      logsUrl && `<a href='${logsUrl}' data-js='open-window'>Logs</a>`
    const metricsLink =
      metricsUrl && `<a href='${metricsUrl}' data-js='open-window'>Metrics</a>`
    const labelEl = description
      ? `<button popovertarget="${label}" class="mermaid--label mermaid--popover-anchor">${label}</button><dialog id="${label}" class="mermaid--popover" popover>${description}</dialog>`
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
