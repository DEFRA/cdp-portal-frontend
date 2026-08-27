import Joi from 'joi'

import { allowedBreakGlassEnvironments } from '../allowed-break-glass-environments.js'

const getAllowedEnvironments = (options) =>
  allowedBreakGlassEnvironments({
    userScopes: options.context.auth?.credentials?.scope,
    teams: options.context.app?.request?.entity.teams
  })

export const launchTerminalParamsValidation = Joi.object({
  serviceId: Joi.string().required()
})

export function launchTerminalPayloadValidation(params, options) {
  const allowedEnvironments = getAllowedEnvironments(options)
  const validationResult = Joi.object({
    environment: Joi.string()
      .valid(...allowedEnvironments)
      .required(),
    tool: Joi.string()
  }).validate(params, options)

  if (validationResult?.error) {
    throw validationResult.error
  }

  return validationResult.value
}

export function terminalBrowserParamsValidation(params, options) {
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
