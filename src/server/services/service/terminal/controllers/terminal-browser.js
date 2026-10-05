import Boom from '@hapi/boom'

import { config } from '#config/config.js'
import {
  terminalBrowserParamsValidation,
  terminalBrowserQueryValidation
} from '../helpers/schema/terminal-params-validation.js'
import { shellAuthCookieName } from '../helpers/set-shell-auth-cookie.js'
import { signShellAuthCookie } from '../helpers/sign-shell-auth-cookie.js'

export const terminalBrowserController = {
  options: {
    validate: {
      params: terminalBrowserParamsValidation,
      query: terminalBrowserQueryValidation,
      failAction: () => Boom.boomify(Boom.forbidden())
    }
  },
  handler: async (request, h) => {
    const params = request.params
    const serviceId = params.serviceId
    const environment = params.environment
    const token = params.token
    const tool = request.query.tool
    const isTerminalTool = !tool || tool.startsWith('terminal')
    // Pass tool so proxy can show the correct wait page before lambda registers image.
    const toolQuery = tool ? `?tool=${encodeURIComponent(tool)}` : ''
    const terminalProxyUrl =
      config.get('terminalProxyUrl').replace('{environment}', environment) +
      `/${token}${toolQuery}`

    request.logger.info(
      `Terminal on url: ${terminalProxyUrl} requested for ${serviceId} in ${environment}`
    )

    request.audit.sendMessage({
      event: 'terminal opened',
      data: {
        terminal: {
          token,
          environment,
          serviceId,
          tool
        }
      }
    })

    // Signed cookie webshell-proxy uses to let only the shell's owner through.
    // Scoped to the shell's token path. TTL should match the shell's max lifetime.
    const { ttl, secret } = config.get('shellAuthCookie')
    const cookieValue = signShellAuthCookie({
      oid: request.auth.credentials.id,
      token,
      ttl,
      secret
    })

    return h
      .view('services/service/terminal/views/terminal-browser', {
        pageTitle: `${isTerminalTool ? 'Terminal' : 'Tool'} - ${environment} - ${serviceId}`,
        serviceId,
        environment,
        terminalProxyUrl,
        isTerminalTool,
        tool
      })
      .state(shellAuthCookieName, cookieValue, { path: `/${token}`, ttl })
  }
}
