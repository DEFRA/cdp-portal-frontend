import Joi from 'joi'

import { allowedBreakGlassEnvironments } from '../allowed-break-glass-environments.js'

const getAllowedEnvironments = (options) =>
  allowedBreakGlassEnvironments({
    userScopes: options.context.auth?.credentials?.scope,
    teams: options.context.app?.request?.entity.teams
  })

function launchTerminalParamsValidation(params, options) {
  const allowedEnvironments = getAllowedEnvironments(options)
  const validationResult = Joi.object({
    serviceId: Joi.string().required(),
    environment: Joi.string()
      .valid(...allowedEnvironments)
      .required()
  }).validate(params, options)

  if (validationResult?.error) {
    throw validationResult.error
  }

  return validationResult.value
}

function terminalBrowserParamsValidation(params, options) {
  const allowedEnvironments = getAllowedEnvironments(options)
  const validationResult = Joi.object({
    serviceId: Joi.string().required(),
    environment: Joi.string()
      .valid(...allowedEnvironments)
      .required(),
    token: Joi.string().required()
  }).validate(params, options)

  if (validationResult?.error) {
    throw validationResult.error
  }

  return validationResult.value
}

export { terminalBrowserParamsValidation, launchTerminalParamsValidation }
