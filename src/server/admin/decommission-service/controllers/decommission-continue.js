import Joi from 'joi'
import Boom from '@hapi/boom'

import { buildErrorDetails } from '~/src/server/common/helpers/build-error-details.js'
import { serviceValidation } from '~/src/server/admin/decommission-service/helpers/schema/service-validation.js'
import { fetchRepositories } from '~/src/server/common/helpers/fetch/fetch-repositories.js'
import { sessionNames } from '~/src/server/common/constants/session-names.js'
import { deleteDeploymentFiles } from '~/src/server/admin/decommission-service/helpers/fetch/delete-deployment-files.js'
import { deleteEcs } from '~/src/server/admin/decommission-service/helpers/fetch/delete-ecs.js'

export const decommissionContinueController = {
  options: {
    validate: {
      params: Joi.object({
        serviceName: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const serviceName = request.params.serviceName
    const authedUser = await request.getUserSession()

    const { repositories } = await fetchRepositories()
    const repositoryNames = repositories.map((repo) => {
      return repo.id
    })

    const validationResult = serviceValidation(
      repositoryNames,
      serviceName
    ).validate({ serviceName, confirmServiceName: serviceName })

    if (validationResult?.error) {
      const errorDetails = buildErrorDetails(validationResult.error.details)

      request.yar.flash(sessionNames.validationFailure, {
        formValues: { serviceName },
        formErrors: errorDetails
      })

      return h.redirect(`/admin/decommission-service/${serviceName}/started`)
    }

    try {
      const deleteFilesResponse = await deleteDeploymentFiles(
        request,
        serviceName
      )
      const deleteEcsResponse = await deleteEcs(request, serviceName)
      if (deleteFilesResponse?.ok && deleteEcsResponse?.ok) {
        request.yar.clear(sessionNames.validationFailure)
        await request.yar.commit(h)

        request.yar.flash(sessionNames.notifications, {
          text: 'Service decommissioned successfully',
          type: 'success'
        })

        request.audit.sendMessage({
          event: `Service decommissioned: ${serviceName} by ${authedUser.id}:${authedUser.displayName}`,
          data: {
            serviceName
          },
          user: request.pre.authedUser
        })

        request.logger.info(`Service ${serviceName} decommissioned`)
        return h.redirect(`/admin/decommission-service/${serviceName}/summary`)
      } else {
        request.logger.error(`Service ${serviceName} decommissioning failed`)
        throw new Error('Service decommission failed')
      }
    } catch (error) {
      request.yar.flash(sessionNames.validationFailure)
      request.yar.flash(sessionNames.globalValidationFailures, error.message)

      return h.redirect(`/admin/decommission-service/${serviceName}/started`)
    }
  }
}
