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
import transformResources from '../utils/transformResources.js'
import createDashboardRows from '../utils/createDashboardRows.js'
import createAlertRows from '../utils/createAlertRows.js'
import { getPlayground } from '../PlaygroundService.js'
import { sessionNames } from '#server/common/constants/session-names.js'
import { fetchEntity } from '#server/common/helpers/fetch/fetch-entities.js'
import { parseISO, subMinutes } from 'date-fns'

const PENDING_TOO_LONG_MINUTES = 20

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

export default async function (request, h) {
  const entityName = request.params?.serviceId ?? request.params?.entityName
  const environment = request.params.environment

  const playground = environment.endsWith('dev')
    ? await getPlayground(entityName).catch((error) => {
        request.logger.error(error, 'Grafana playground load failed:')

        request.yar.flash(
          sessionNames.globalValidationFailures,
          'Failed to load playgrounds'
        )
        return { status: 'FAILED', alerts: [], dashboards: [] }
      })
    : {}

  // Explicitly fetch entity after the playgrounds, to prevent stale data on promotion state change
  const entity = environment.endsWith('dev')
    ? await fetchEntity(entityName)
    : request.app.entity

  if (playground.status === 'LOADED') {
    request.yar.set(sessionNames.grafanaPlayground, playground)
    await request.yar.commit(h)
  }

  const hasPendingPromotionTakingTooLong =
    getPromotionsTakingTooLong(playground)

  const resources = transformResources(entity.environments[environment])

  function logViewUrl(type) {
    return `https://logs.${environment}.cdp-int.defra.cloud/_dashboards/app/discover#/view/${entity.name}-${type}`
  }

  const serviceExistsInEnvironment = !!entity.environments[environment]

  return {
    environment,
    resources,
    playground,
    renderLinks,
    logViewUrl,
    apigwMetricLink,
    serviceExistsInEnvironment,
    createDashboardRows,
    createAlertRows,
    hasPendingPromotionTakingTooLong,
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

function getPromotionsTakingTooLong(playground) {
  if (playground.status !== 'LOADED') return false

  const { dashboards = [] /*, alerts = [] */ } = playground

  const pendingDashboards = dashboards.filter(
    (dashboard) => !dashboard.promoted && dashboard.promotion_request
  )
  // const pendingAlerts = [] // TODO

  const now = Date.now()
  const takingTooLong = pendingDashboards.some(
    ({ updated }) =>
      parseISO(updated) < subMinutes(now, PENDING_TOO_LONG_MINUTES)
  )

  return takingTooLong
}
