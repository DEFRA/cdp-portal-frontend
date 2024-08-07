import Joi from 'joi'
import Boom from '@hapi/boom'
import { compose } from 'lodash/fp'

import { sortByEnv } from '~/src/server/common/helpers/sort/sort-by-env'
import { provideService } from '~/src/server/services/helpers/pre/provide-service'
import { provideCanDeploy } from '~/src/server/services/helpers/pre/provide-can-deploy'
import { withEnvironments } from '~/src/server/common/transformers/with-environments'
import { serviceToEntityDataList } from '~/src/server/services/about/transformers/service-to-entity-data-list'
import { fetchRunningServicesById } from '~/src/server/common/helpers/fetch/fetch-running-services-by-id'
import { buildRunningServicesRowHeadings } from '~/src/server/common/helpers/build-running-services-row-headings'
import { getEnvironmentsByTeam } from '~/src/server/common/helpers/environments/get-environments-by-team'
import { runningServicesToEntityRow } from '~/src/server/common/transformers/running-services-to-entity-row'
import { fetchAvailableVersions } from '~/src/server/deploy-service/helpers/fetch/fetch-available-versions'

const serviceController = {
  options: {
    id: 'services/{serviceId}',
    pre: [[provideService], provideCanDeploy],
    validate: {
      params: Joi.object({
        serviceId: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const serviceId = request.params?.serviceId
    const service = request.pre.service

    const availableVersions = await fetchAvailableVersions(service.serviceName)
    const environments = getEnvironmentsByTeam(service.teams)
    const runningServices = (await fetchRunningServicesById(serviceId)) ?? []
    const runningServicesEntityRows = compose(
      runningServicesToEntityRow(environments),
      withEnvironments
    )(runningServices)
    const envsWithDeployment = [
      ...new Set(
        runningServices.map((runningService) => runningService.environment)
      )
    ]
      .filter((env) => Object.values(environments).includes(env))
      .sort(sortByEnv)

    return h.view('services/about/views/service', {
      pageTitle: `${service.serviceName} microservice`,
      runningServicesEntityRows,
      envsWithDeployment,
      heading: service.serviceName,
      rowHeadings: buildRunningServicesRowHeadings(environments),
      entityDataList: serviceToEntityDataList(service),
      service,
      canDeploy: request.pre.canDeploy,
      latestVersions: availableVersions.slice(0, 4),
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
