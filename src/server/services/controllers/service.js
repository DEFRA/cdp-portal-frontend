import Joi from 'joi'
import Boom from '@hapi/boom'
import { compose } from 'lodash/fp'

import { config } from '~/src/config'
import { sortByEnv } from '~/src/server/common/helpers/sort/sort-by-env'
import { provideService } from '~/src/server/services/helpers/pre/provide-service'
import { withEnvironments } from '~/src/server/common/transformers/with-environments'
import { serviceToEntityDataList } from '~/src/server/services/transformers/service-to-entity-data-list'
import { fetchRunningServicesById } from '~/src/server/services/helpers/fetch/fetch-running-services-by-id'
import { runningServicesToEntityRow } from '~/src/server/services/transformers/running-services-to-entity-row'
import { getEnvironments } from '~/src/server/common/helpers/environments/get-environments'
import { kebabCase, upperFirst } from 'lodash'

function buildRunningServicesRowHeadings(environments) {
  return [
    ...Object.keys(environments).map((key) => ({
      text: upperFirst(kebabCase(key)),
      size: 'medium'
    }))
  ]
}

const serviceController = {
  options: {
    pre: [provideService],
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

    const isPlatformService = service.teams
      .map((team) => team.teamId)
      .includes(config.get('oidcAdminGroupId'))
    const environments = getEnvironments(isPlatformService)
    const runningServices = await fetchRunningServicesById(serviceId)
    const runningServicesEntityRows = compose(
      runningServicesToEntityRow(environments),
      withEnvironments
    )(runningServices)

    const envsWithDeployment = [
      ...new Set(
        runningServices.map((runningService) => runningService.environment)
      )
    ].sort(sortByEnv)

    return h.view('services/views/service', {
      pageTitle: `${service.serviceName} microservice`,
      runningServicesEntityRows,
      envsWithDeployment,
      heading: service.serviceName,
      rowHeadings: buildRunningServicesRowHeadings(environments),
      entityDataList: serviceToEntityDataList(service),
      service,
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
