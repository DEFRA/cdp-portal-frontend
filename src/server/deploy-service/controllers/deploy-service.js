import { appConfig } from '~/src/config'
import { deployImageValidationSchema } from '~/src/server/deploy-service/helpers/deploy-image-validation-schema'
import { fetchDeployableImageNames } from '~/src/server/deploy-service/helpers/fetch-deployable-image-names'
import { transformImageNamesToOptions } from '~/src/server/deploy-service/transformers/transform-image-names-to-options'
import { fetchAvailableVersions } from '~/src/server/deploy-service/helpers/fetch-available-versions'
import { buildSelectOptions } from '~/src/common/helpers/build-select-options'
import { optionsWithMessage } from '~/src/server/common/helpers/options-with-message'
import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details'

const deployServiceController = {
  handler: async (request, h) => {
    const payload = request?.payload
    const deployableImageNames = await fetchDeployableImageNames()
    const availableVersions = await fetchAvailableVersions(payload?.imageName)

    const validationResult = deployImageValidationSchema(
      deployableImageNames,
      availableVersions
    ).validate(payload, {
      abortEarly: false
    })

    if (validationResult?.error) {
      const errorDetails = buildErrorDetails(validationResult.error.details)

      return h.view('deploy-service/views/form', {
        pageTitle: 'Error | Deploy a micro-service',
        heading: 'Deploy a micro-service',
        deployableImagesOptions:
          transformImageNamesToOptions(deployableImageNames),
        versions: availableVersions?.length
          ? buildSelectOptions(availableVersions)
          : optionsWithMessage('Choose a service name'),
        errors: errorDetails,
        values: payload
      })
    }

    if (!validationResult.error) {
      const deployServiceEndpointUrl = `${appConfig.get(
        'selfServiceOpsApiUrl'
      )}/deploy-service`

      await fetch(deployServiceEndpointUrl, {
        method: 'post',
        body: JSON.stringify({
          imageName: validationResult.value.imageName,
          version: validationResult.value.version,
          environment: validationResult.value.environment,
          instances: validationResult.value.instances,
          cpu: validationResult.value.cpu,
          memory: validationResult.value.memory
        }),
        headers: { 'Content-Type': 'application/json' }
      })

      request.yar.flash('notifications', {
        text: 'Service deployment successfully requested',
        type: 'success'
      })

      return h.redirect(`${appConfig.get('appPathPrefix')}/deploy-service`)
    }
  }
}

export { deployServiceController }
