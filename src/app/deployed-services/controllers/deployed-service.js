import { appConfig } from '~/src/config'
import { fetchDeployedService } from '~/src/app/deployed-services/helpers/fetch-deployed-service'
import { transformDeployedServiceToHeadingEntities } from '~/src/app/deployed-services/transformers/transform-deployed-service-to-heading-entities'

const deployedServiceController = {
  handler: async (request, h) => {
    const deployedService = await fetchDeployedService(
      request.params?.serviceDeploymentId
    )

    return h.view('deployed-services/views/deployed-service', {
      pageTitle: `${deployedService.serviceName} Service Deployment`,
      heading: deployedService.serviceName,
      deployedService,
      headingEntities:
        transformDeployedServiceToHeadingEntities(deployedService),
      breadcrumbs: [
        {
          text: 'Deployed Services',
          href: `${appConfig.get('appPathPrefix')}/deployed-services`
        },
        {
          text: deployedService.serviceName
        }
      ]
    })
  }
}

export { deployedServiceController }
