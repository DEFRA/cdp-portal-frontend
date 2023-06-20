import { fetchDeployableImageNames } from '~/src/server/deploy-service/helpers/fetch-deployable-image-names'
import { transformImageNamesToOptions } from '~/src/server/deploy-service/transformers/transform-image-names-to-options'
import { optionsWithMessage } from '~/src/server/common/helpers/options-with-message'

const deployServiceFormController = {
  handler: async (request, h) => {
    const deployableImageNames = await fetchDeployableImageNames()

    return h.view('deploy-service/views/form', {
      pageTitle: 'Deploy a micro-service',
      heading: 'Deploy a micro-service',
      deployableImagesOptions:
        transformImageNamesToOptions(deployableImageNames),
      versions: optionsWithMessage('Choose a service name')
    })
  }
}

export { deployServiceFormController }
