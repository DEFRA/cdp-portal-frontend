import Joi from 'joi'
import Boom from '@hapi/boom'
import compose from 'lodash/fp/compose.js'

import { environments } from '~/src/config/environments.js'
import { sortByEnv } from '~/src/server/common/helpers/sort/sort-by-env.js'
import { provideService } from '~/src/server/services/helpers/pre/provide-service.js'
import { provideIsServiceOwner } from '~/src/server/services/helpers/pre/provide-is-service-owner.js'
import { withEnvironments } from '~/src/server/common/transformers/with-environments.js'
import { serviceToEntityDataList } from '~/src/server/services/about/transformers/service-to-entity-data-list.js'
import { fetchRunningServicesById } from '~/src/server/common/helpers/fetch/fetch-running-services-by-id.js'
import { buildRunningServicesRowHeadings } from '~/src/server/common/helpers/build-running-services-row-headings.js'
import { runningServicesToEntityRow } from '~/src/server/common/transformers/running-services-to-entity-row.js'
import { fetchAvailableVersions } from '~/src/server/deploy-service/helpers/fetch/fetch-available-versions.js'
import { fetchVanityUrls } from '~/src/server/services/helpers/fetch/fetch-vanity-urls.js'
import { transformVanityUrls } from '~/src/server/services/about/transformers/vanity-urls.js'
import { getEnvironments } from '~/src/server/common/helpers/environments/get-environments.js'

async function provideVanityUrls(request) {
  const serviceId = request.params?.serviceId
  const vanityUrls = await fetchVanityUrls(serviceId, request.logger)

  if (vanityUrls) {
    return transformVanityUrls(vanityUrls)
  }

  return null
}

async function provideRunningServicesData(request) {
  const serviceId = request.params?.serviceId
  // TODO this needs to be based on the services team and not the user
  const viewableEnvironments = getEnvironments(request.auth.credentials?.scope)
  const runningServices = (await fetchRunningServicesById(serviceId)) ?? []

  // TODO environments, this needs to be based on the services team and not the user
  const rowHeadings = buildRunningServicesRowHeadings(environments)

  const runningServicesEntityRows = compose(
    runningServicesToEntityRow(environments),
    withEnvironments
  )(runningServices)

  const environmentsWithADeployment = [
    ...new Set(runningServices.map((rs) => rs.environment))
  ]
    .filter((env) => environments.includes(env))
    .sort(sortByEnv)

  return { rowHeadings, runningServicesEntityRows, environmentsWithADeployment }
}

const serviceController = {
  options: {
    id: 'services/{serviceId}',
    pre: [[provideService], provideIsServiceOwner],
    validate: {
      params: Joi.object({
        serviceId: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const service = request.pre.service
    const isServiceOwner = request.pre.isServiceOwner

    if (service === null) {
      return Boom.notFound()
    }

    const entityDataList = serviceToEntityDataList(service)
    const availableVersions = await fetchAvailableVersions(service.serviceName)
    const latestVersions = availableVersions.slice(0, 4)
    const vanityUrls = await provideVanityUrls(request)
    const {
      rowHeadings,
      runningServicesEntityRows,
      environmentsWithADeployment
    } = await provideRunningServicesData(request)

    return h.view('services/about/views/service', {
      pageTitle: `${service.serviceName} microservice`,
      heading: service.serviceName,
      vanityUrls,
      service,
      isServiceOwner,
      environmentsWithADeployment,
      runningServicesEntityRows,
      rowHeadings,
      entityDataList,
      latestVersions,
      breadcrumbs: [
        {
          text: 'Services',
          href: '/services'
        },
        {
          text: service.serviceName
        }
      ]
    })
  }
}

export { serviceController }
