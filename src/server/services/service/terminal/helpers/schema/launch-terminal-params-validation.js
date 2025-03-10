import Joi from 'joi'
import { terminalEnvironments } from '~/src/server/services/service/terminal/helpers/can-launch-terminal.js'

function launchTerminalParamsValidation(params, options) {
  const scopes = options.context.auth.credentials?.scope

  const validEnvironments = terminalEnvironments(scopes)

  const validationResult = Joi.object({
    serviceId: Joi.string().required(),
    environment: Joi.string()
      .valid(...validEnvironments)
      .required()
  }).validate(params, options)

  if (validationResult?.error) {
    throw validationResult.error
  }

  return validationResult.value
}

export { launchTerminalParamsValidation }
