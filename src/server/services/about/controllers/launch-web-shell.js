import Joi from 'joi'
import Boom from '@hapi/boom'

import { environments } from '~/src/config'
import { sessionNames } from '~/src/server/common/constants/session-names'
import { deployWebShell } from '~/src/server/services/about/helpers/fetch/deploy-web-shell'

const launchWebShellController = {
  options: {
    validate: {
      params: Joi.object({
        serviceId: Joi.string().required(),
        // TODO tenant/Admin environments
        environment: Joi.string()
          .valid(...Object.values(environments).filter((env) => env !== 'prod'))
          .required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const serviceId = request.params.serviceId
    const environment = request.params.environment

    try {
      const { response, json } = await deployWebShell(
        request,
        serviceId,
        environment
      )

      if (response?.ok) {
        return h.redirect(
          `/services/${json.service}/web-shell/${json.environment}/${json.token}`
        )
      }
    } catch (error) {
      request.yar.flash(sessionNames.globalValidationFailures, error.message)

      return h.redirect(`/services/${serviceId}/web-shell/${environment}`)
    }
  }
}

export { launchWebShellController }
