import Boom from '@hapi/boom'

import { scopes } from '@defra/cdp-validation-kit'
import { sortBy } from '../../../common/helpers/sort/sort-by.js'
import { availableEnvironments } from './helpers/available-environments.js'
import { transformRunningServices } from './transformers/running-services.js'
import { fetchAboutServiceData } from './helpers/fetch-about-service-data.js'
import { transformServiceToSummary } from './transformers/service-to-summary.js'
import { obtainServiceUrls } from '../../../common/helpers/service-urls/obtain-service-urls.js'
import { obtainLogsAndMetricsUrls } from '../../../common/helpers/obtain-logs-and-metrics-urls.js'
import { isBackendEntity, isFrontendEntity } from '../../helpers/entity-type.js'

async function aboutHandler(request, h) {
  const entity = request.app.entity
  const userSession = request.auth.credentials

  if (entity == null) {
    return Boom.notFound()
  }

  const serviceName = entity.name
  const userScopes = userSession?.scope

  const teamIds = entity.teams.map(({ teamId }) => teamId)
  const isServiceOwner = await request.userIsServiceOwner(teamIds)

  const hasPostgresPermission = userScopes?.includes(
    scopes.restrictedTechPostgres
  )
  const latestCount = 6

  const isPostgres = Object.values(entity.environments).some(
    ({ sql_database }) => sql_database
  )

  const {
    availableVersions,
    repository,
    availableMigrations: migrations,
    latestMigrations
  } = await fetchAboutServiceData({
    serviceName,
    isPostgres
  })
  const latestPublishedImageVersions = availableVersions
    .sort(sortBy('created'))
    .slice(0, latestCount)
  const availableMigrations = migrations.slice(0, latestCount)

  const { runningServices } = await transformRunningServices(serviceName)

  const availableServiceEnvironments = availableEnvironments({
    userScopes,
    entity
  })

  const { shutteredUrls, serviceUrls, vanityUrls } = obtainServiceUrls(
    request.app.entity.environments,
    availableServiceEnvironments
  )

  const { logsDetails, metricsDetails } = obtainLogsAndMetricsUrls(
    request.app.entity,
    availableServiceEnvironments
  )

  const isFrontend = isFrontendEntity(entity)
  const isBackend = isBackendEntity(entity)
  const description = repository?.description

  const service = {
    serviceName,
    isBackend,
    isFrontend,
    isPostgres,
    description
  }

  return h.view('services/service/about/views/about', {
    pageTitle: `${serviceName} microservice`,
    summaryList: transformServiceToSummary(repository, entity),
    service,
    isServiceOwner,
    hasPostgresPermission,
    availableServiceEnvironments,
    runningServices,
    latestPublishedImageVersions,
    availableMigrations,
    latestMigrations,
    shutteredUrls,
    serviceUrls,
    vanityUrls,
    logsDetails,
    metricsDetails,
    breadcrumbs: [
      {
        text: 'Services',
        href: '/services'
      },
      {
        text: serviceName
      }
    ]
  })
}

export { aboutHandler }
