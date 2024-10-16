import Joi from 'joi'
import Boom from '@hapi/boom'

import { environments, config } from '~/src/config'
import { fetchWebShellStatus } from '~/src/server/services/about/helpers/fetch/fetch-web-shell-status'

const webShellController = {
  options: {
    validate: {
      params: Joi.object({
        serviceId: Joi.string().required(),
        // TODO tenant/Admin environments
        environment: Joi.string()
          .valid(...Object.values(environments).filter((env) => env !== 'prod'))
          .required(),
        token: Joi.string().required()
      }),
      failAction: () => Boom.boomify(Boom.notFound())
    }
  },
  handler: async (request, h) => {
    const params = request.params
    const serviceId = params.serviceId
    const environment = params.environment
    const token = params.token

    const webShell = {}
    const webShellUrl =
      config.get('webShellUrl').replace('{environment}', environment) +
      `/${token}`

    try {
      const webShellResponse = await fetchWebShellStatus(environment, token)
      webShell.shouldPoll = webShellResponse.status !== 200

      const isReady = webShellResponse.status === 200
      webShell.successMessage = isReady ? 'Web shell is ready' : ''
      webShell.url = isReady ? webShellUrl : ''
    } catch (error) {
      webShell.exceptionMessage = error.message
    }

    return h.view('services/about/views/web-shell', {
      pageTitle: `Web shell - ${serviceId} - ${environment}`,
      serviceId,
      environment,
      token,
      webShell
    })
  }
}

export { webShellController }
