import { noSessionRedirect } from '~/src/server/deploy-service/helpers/ext/no-session-redirect'
import { transformDeploymentRows } from '~/src/server/deploy-service/transformers/transform-deployment-rows'
import { provideDeployment } from '~/src/server/deploy-service/helpers/pre/provide-deployment'
import { fetchDeployServiceOptions } from '~/src/server/deploy-service/helpers/fetch-deploy-service-options'
import { buildHelpText } from '~/src/server/deploy-service/helpers/build-help-text'

const summaryController = {
  options: {
    ext: {
      onPreHandler: [noSessionRedirect]
    },
    pre: [provideDeployment]
  },
  handler: async (request, h) => {
    const deployment = request.pre?.deployment

    const { cpuOptions, ecsCpuToMemoryOptionsMap } =
      await fetchDeployServiceOptions()

    const cpuDetail = cpuOptions.find(
      ({ value }) => value === parseInt(deployment?.cpu, 10)
    )
    const memoryDetail = ecsCpuToMemoryOptionsMap[deployment?.cpu]?.find(
      ({ value }) => value === parseInt(deployment?.memory, 10)
    )

    return h.view('deploy-service/views/summary', {
      pageTitle: 'Deploy Service Summary',
      heading: 'Summary',
      headingCaption:
        'Information about the Microservice you are going to deploy.',
      helpText: buildHelpText(cpuDetail?.value, memoryDetail?.value),
      deploymentRows: transformDeploymentRows(
        deployment,
        cpuDetail,
        memoryDetail
      ),
      formButtonText: 'Deploy'
    })
  }
}

export { summaryController }
